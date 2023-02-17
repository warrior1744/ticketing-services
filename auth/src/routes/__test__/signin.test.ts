import request from 'supertest'
import { app } from '../../app'

//#1
it('signin failed, user does not exist', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            username: 'johnny',
            email: 'john@example.com',
            password: 'thisispassword'
        })
        .expect(201)

    await request(app)
    .post('/api/users/signin')
    .send({
        email: 'john2@example.com',
        password: 'thisispassword'
    })
    .expect(400)
})

//#2
it('signin failed, password not match', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            username: 'johnny',
            email: 'john@example.com',
            password: 'thisispassword'
        })
        .expect(201)

    return request(app)
    .post('/api/users/signin')
    .send({
        email: 'john@example.com',
        password: 'wrongpassword'
    })
    .expect(400)
})

//#3
it('sets a cookie after signup', async () => {
    await request(app)
    .post('/api/users/signup')
    .send({
        username: 'johnny',
        email: 'john@example.com',
        password: 'thisispassword'
    })
    .expect(201)

    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email: 'john@example.com',
            password: 'thisispassword'            
        })
        .expect(200)

    expect(response.get('Set-Cookie')).toBeDefined()
})

//#4
it('signin ok', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            username: 'johnny',
            email: 'john@example.com',
            password: 'thisispassword'
        })
        .expect(201)

    await request(app)
    .post('/api/users/signin')
    .send({
        email: 'john@example.com',
        password: 'thisispassword'
    })
    .expect(200)
})