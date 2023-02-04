import request from 'supertest'
import { app } from '../../app'

//#1
it('responds info about the current user', async () => {
    
    //call the global function in setup.ts
    const cookie = await signupForCookie()

    const response = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie',cookie)
        .send()
        .expect(200)

    expect(response.body.currentUser.email).toEqual('john@example.com')
})

it('responds currentUser info as null if no cookie provided', async () => {

    const response = await request(app)
        .get('/api/users/currentuser')
        .send()
        .expect(200)

    expect(response.body.currentUser).toEqual(null)
})