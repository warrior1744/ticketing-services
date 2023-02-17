import request from 'supertest'
import { app } from '../../app'

//#1
it('signup test returns a 201', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({ 
            username: 'johnny',
            email: 'john@example.com',
            password: 'thisispassword'
        })
        .expect(201)
})

//#2
it('returns a 400 with an invalid email', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            username: 'johnny',
            email:'john',
            paswrrod: 'thisispassword'
        })
        .expect(400)
})

//#3
it('returns a 400 with an invalid password', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            username: 'johnny',
            email:'john@example.com',
            paswrrod: 'pwd'
        })
        .expect(400)
})

//#4
it('returns a 400 with missing email and pwd', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({})
        .expect(400)
})

//#5
it('disallows duplicate emails', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            username: 'johnny',
            email: 'john@example.com',
            password: 'thisispassword'            
        })
        .expect(201)
    
    await request(app)
        .post('/api/users/signup')
        .send({
            username: 'johnny',
            email: 'john@example.com',
            password: 'thisispassword'            
        })
        .expect(400)
})

//#6
it('sets a cookie after signup', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            username: 'johnny',
            email: 'john@example.com',
            password: 'thisispassword'            
        })
        .expect(201)
    expect(response.get('Set-Cookie')).toBeDefined()
})