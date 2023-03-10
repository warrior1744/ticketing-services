import { TicketCreatedListener } from "../ticket-created-listener"
import { natsWrapper } from "../../../nats/nats-wrapper"
import { TicketCreatedEvent } from "@jimtickets/common"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../../models/ticket"


const setup = async () => {
    //create an instance of the listener
    const listener = new TicketCreatedListener(natsWrapper.client)
    //create a fake data event (a published event)
    const data: TicketCreatedEvent['data'] = {
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Michael Jackson concert',
        price: 200,
        image: '',
        userId: new mongoose.Types.ObjectId().toHexString()
    }
    //create a fake message object
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg}
}

it('creates and saves a ticket', async () => {
    const { listener, data, msg} = await setup()
    //call the onMessage function with the data object + message object 
    await listener.onMessage(data, msg)
    //write assertions to make sure a ticket was created
    const ticket = await Ticket.findById(data.id)
    expect(ticket).toBeDefined()
    expect(ticket!.title).toEqual(data.title)
    expect(ticket!.price).toEqual(data.price)
})

it('acks the message of ticket-created-listener', async () => {
    //call the onMessage function with the data object + message object 
    const { listener, data, msg} = await setup()
    await listener.onMessage(data, msg)
    //write assertions to make sure ack function is called
    expect(msg.ack).toBeCalled()
})