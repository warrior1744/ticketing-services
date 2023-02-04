import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose';
import { Ticket } from '../../models/ticket';


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

it('fetch all orders', async () => {
    const ticket1 = await buildTicket()
    const ticket2 = await buildTicket()
    const ticket3 = await buildTicket()

    const user1 = global.signin()
    const user2 = global.signin()
    //create 1 order for user1
    await request(app)
        .post('/api/orders')
        .set('Cookie', user1)
        .send({ticketId: ticket1.id})
        .expect(201)
    //create 2 orders for user2
    const { body: order1Body} = await request(app)
        .post('/api/orders')
        .set('Cookie', user2)
        .send({ticketId: ticket2.id})
        .expect(201)
    const { body: order2Body} = await request(app)
        .post('/api/orders')
        .set('Cookie', user2)
        .send({ticketId: ticket3.id})
        .expect(201)

    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', user2)
        .expect(200)
    expect(response.body.length).toEqual(2)
    expect(response.body[0].id).toEqual(order1Body.id)
    expect(response.body[1].id).toEqual(order2Body.id)
    expect(response.body[0].ticket.id).toEqual(ticket2.id)
    expect(response.body[1].ticket.id).toEqual(ticket3.id)
})