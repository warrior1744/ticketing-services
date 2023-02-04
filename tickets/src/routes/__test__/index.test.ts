import request from 'supertest'
import { app } from '../../app'

const createTicket = async () => {
    return await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title: 'sports',
        price: 35
    })
    .expect(201)
}

it('fetch all tickets', async () => {
    await createTicket()
    await createTicket()
    await createTicket()
    const response = await request(app)
        .get('/api/tickets')
        .send()
        .expect(200)

    expect(response.body.length).toEqual(3)
})