import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats/nats-wrapper";

it("has a route handler listening to /api/tickets for post requests", async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send({})

    expect(response.status).not.toEqual(404)
});

it("can only be accessed if the user is signed in", async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send({})

    expect(response.status).toEqual(401)
});

it("returns a status other than 401 if the user is signed in", async () =>{
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({})
    
    expect(response.status).not.toEqual(401)
})

it("returns an error if an invalid title is provided", async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
        title: '' ,
        price: 100,
        image: '',
        })
        .expect(400)

    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            price: 10,
            image: ''
        })
        .expect(400)
});

it("returns an error if an invalid price is provided", async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
        title: 'someValideTitle' ,
        price: -100,
        image: ''
        })
        .expect(400)

    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'someValideTitle' ,
            image: ''
        })
        .expect(400)
});

it("creates a ticket with valid inputs", async () => {

    let tickets = await Ticket.find({})
    expect(tickets.length).toEqual(0)

    const title = 'someValidTitle'

    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
        title,
        price: 100,
        image: ''
        })
        .expect(201)

    tickets = await Ticket.find({})
    expect(tickets.length).toEqual(1)
    expect(tickets[0].price).toEqual(100)
    expect(tickets[0].title).toEqual(title)
});

it('Published a new event', async () => {
    const title = 'someValidTitle'

    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
        title,
        price: 100,
        image: ''
        })
        .expect(201)

    expect(natsWrapper.client.publish).toHaveBeenCalled()
    // @ts-ignore
    console.log(natsWrapper.client.publish.mock.calls)
})