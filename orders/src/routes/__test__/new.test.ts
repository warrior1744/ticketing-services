import request from 'supertest'
import { app } from "../../app"
import { Ticket } from '../../models/ticket'
import { Order, OrderStatus } from '../../models/order'
import { natsWrapper } from "../../nats/nats-wrapper";
import mongoose from 'mongoose';
import { response } from 'express';


const buildTicket = async () => {
    const ticketId = new mongoose.Types.ObjectId().toHexString()
    const ticket = Ticket.build({
      id: ticketId,
      title: "newTicketTitle",
      price: 120,
    });
    await ticket.save();
    return ticket;
};

it("returns NOT FOUND error if the ticket is not found", async () => {
    const ticketId = new mongoose.Types.ObjectId()
    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ticketId})
        .expect(404)
})

it("returns BAD REQUEST error if the ticket is reserved", async () => {
    const ticket = await buildTicket();
    const order = Order.build({
        ticket,
        userId: 'validUserID',
        status: OrderStatus.Created,
        expiresAt: new Date()
    })
    await order.save()

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({
            ticketId: ticket.id  
        })
    .expect(400)
})

it('reserves a ticket', async () => {
    const ticket = await buildTicket();
    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({
            ticketId: ticket.id
        })
        .expect(201)
})

it('emits an order created event', async () => {
    const ticket = await buildTicket();
    const currentUser = global.signin();
  
    await request(app)
      .post('/api/orders')
      .set('Cookie', currentUser)
      .send({ ticketId: ticket.id })
      .expect(201)
   
    expect(natsWrapper.client.publish).toHaveBeenCalled()
    // @ts-ignore
    console.log(natsWrapper.client.publish.mock.calls)
})