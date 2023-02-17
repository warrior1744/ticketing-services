import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { natsWrapper } from "../../nats/nats-wrapper";
import { Ticket } from '../../models/ticket';

it('returns a 404 if the provided id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString()

    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'someticketid',
            price: 40,
            image: ''
        })
        .expect(404)

})

it('returns a 401 if the user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'someticketid',
            price: 40,
            image: ''
        })
        .expect(401)
})

it('returns a 401 if the user does not own the ticket', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'someticketid',
            price: 35,
            image: ''
        })
    
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'someticketid',
            price: 35,
            image: ''
        })
        .expect(401)
})

it('returns a 400 if the user provides an invalid title or price', async () => {
    const cookie = global.signin()

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'someotherticket',
            price: 10,
            image: ''
        })

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 15,
            image: ''
        })
        .expect(400)

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
        title: 'somevalidtitle',
        price: -15,
        image: ''
    })
    .expect(400)
})

it('update the ticket if provided valid info', async () => {
    const cookie = global.signin()

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'someotherticket',
            price: 10,
            image: ''
        })  
    
        await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'updatedTitleTicket',
            price: 15,
            image: ''
        })
        .expect(200)
        
    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
    
        expect(ticketResponse.body.title).toEqual('updatedTitleTicket')
        expect(ticketResponse.body.price).toEqual(15)
})

it('Published an update event', async () => {
    const cookie = global.signin()

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'someotherticket',
            price: 10,
            image: ''
    })  
    
    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
        title: 'updatedTitleTicket',
        price: 15,
        image: ''
    })
    .expect(200)

    expect(natsWrapper.client.publish).toHaveBeenCalled()
    // @ts-ignore
    console.log(natsWrapper.client.publish.mock.calls)
})

it('rejects updates if the ticket is reserved by an order', async () => {
    const cookie = global.signin()

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'Michael Jackson concert',
            price: 150,
            image: ''
        })  

        const ticket = await Ticket.findById(response.body.id)
        ticket!.set({
            orderId: new mongoose.Types.ObjectId().toHexString()
        })
        await ticket!.save()
    
        await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'Michael Jackson concert',
            price: 250,
            image: ''
        })
        .expect(400)
})


