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

it('fetch order by id', async () => {
    const ticket = await buildTicket()
    const currentUser = global.signin()
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', currentUser)
        .send({ticketId: ticket.id})
        .expect(201)
    
    const { body: fetchedOrder} = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', currentUser)
        .send()
        .expect(200)
      
    expect(fetchedOrder.id).toEqual(order.id)
})

it('returns an error if one user fetch another users order', async () => {
    const ticket = await buildTicket()
    const currentUser = global.signin()

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', currentUser)
        .send({ticketId: ticket.id})
        .expect(201)
  
    await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', global.signin())
        .send()
        .expect(401)
})

