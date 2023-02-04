import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats/nats-wrapper";
import { OrderCreatedEvent, OrderStatus } from "@jimtickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
    //create an instance of the listener
    const listener = new OrderCreatedListener(natsWrapper.client)
    //create and save a ticket for the order
    const ticket = Ticket.build({
        title: 'Michael Jackson concert',
        price: 200,
        userId: new mongoose.Types.ObjectId().toHexString()
    })
    await ticket.save()
    //create a fake data event ( a published event)
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: 'new date',
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    }
    //create a fake message object
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg, ticket}
}

it('sets the orderId of the ticket', async () => {
    const { listener, ticket, data, msg } = await setup()
    await listener.onMessage(data, msg)
    const updatedTicket = await Ticket.findById(ticket.id)
    expect(updatedTicket).toBeDefined()
    expect(updatedTicket!.orderId).toEqual(data.id)
})

it('publishes a ticket\'s property, orderId updated event', async () => {
    const { listener, ticket, data, msg } = await setup()
    await listener.onMessage(data, msg)
    expect(natsWrapper.client.publish).toHaveBeenCalled()
    // @ts-ignore
    console.log(natsWrapper.client.publish.mock.calls)
    const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])

    expect(ticketUpdatedData.orderId).toEqual(data.id)
})

it('acks the message of order-created-listener', async () => {
    const { listener, data, msg } = await setup()
    await listener.onMessage(data, msg)
    expect(msg.ack).toBeCalled()
})
