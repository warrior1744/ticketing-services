import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats/nats-wrapper";
import { OrderCreatedEvent } from "@jimtickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";
import { OrderStatus } from "@jimtickets/common";


const setup = async () => {
    //create an instance of the listener
    const listener = new OrderCreatedListener(natsWrapper.client)
    //create a fake data event (a published event)
    const data: OrderCreatedEvent['data'] = {
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: 'someUser',
        status: OrderStatus.Created,
        expiresAt: 'validDate',
        ticket: {
            id: 'validTicketId',
            price: 200
        }
    }
    //create a fake message object
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg}
}

it('replicates the order info', async () => {
    const { listener, data, msg } = await setup()
    await listener.onMessage(data, msg)
    const order = await Order.findById(data.id)
    expect(order!.price).toEqual(data.ticket.price)
})

it('acks the message', async () => {
    const { listener, data, msg } = await setup()
    await listener.onMessage(data, msg)
    expect(msg.ack).toBeCalled()
})