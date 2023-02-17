import { TicketUpdatedListener } from "../ticket-updated-listener";
import { natsWrapper } from "../../../nats/nats-wrapper";
import { TicketUpdatedEvent } from "@jimtickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
    //create an instance of the listener
    const listener = new TicketUpdatedListener(natsWrapper.client)
    //create and save a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Michael Jackson concert',
        price: 200
    })
    await ticket.save()
    //create a fake data event, pretending the data was published
    const data: TicketUpdatedEvent['data'] = {
        version: ticket.version+1, //updated ticket must add 1 version
        id: ticket._id,
        title: ticket.title,
        price: ticket.price + 20, //updated ticket price
        image: ticket.image,
        userId: new mongoose.Types.ObjectId().toHexString()
    }
    //create a fake message object
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg, ticket}
}

it('updates and saves a ticket', async () => {
    const { listener, data, msg, ticket} = await setup()
    //call the onMessage function with the data object + message object 
    await listener.onMessage(data, msg)

    const updatedTicket = await Ticket.findById(ticket.id)
    //write assertions to make sure a ticket was updated
    expect(updatedTicket).toBeDefined()
    expect(updatedTicket!.title).toEqual(data.title)
    expect(updatedTicket!.price).toEqual(data.price)
    expect(updatedTicket!.version).toEqual(data.version)
})

it('acks the message of ticket-updated-listener', async () => {
    //call the onMessage function with the data object + message object 
    const { listener, data, msg} = await setup()
    await listener.onMessage(data, msg)
    //write assertions to make sure ack function is called
    expect(msg.ack).toBeCalled()
})

it('does not call ack if the event has a skipped version number', async () => {
    const { msg, data, listener, ticket} = await setup()
    data.version = 10 //change the version to future version
    try{
        await listener.onMessage(data, msg)
    }catch(err){}
    expect(msg.ack).not.toBeCalled()
})