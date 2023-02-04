import request from 'supertest'
import { app } from '../../app'
import { Order, OrderStatus } from '../../models/order'
import { natsWrapper } from '../../nats/nats-wrapper'
import mongoose from 'mongoose'
import { response } from 'express'
import { stripe } from '../../stripe/stripe'
import { Payment } from '../../models/payment'

const buildOrder = async ( status: OrderStatus, userId?: string, price?: number) => {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId: userId || new mongoose.Types.ObjectId().toHexString(),
        status: status,
        price: price || 2000
    })
    await order.save()
    return order
}

it('returns a 404 when purchasing an order that does not exist', async ()=> {
    const currentUser = global.signin();
    await request(app)
        .post('/api/payments')
        .set('Cookie', currentUser)
        .send({
            token: 'randomToken',
            orderId: new mongoose.Types.ObjectId().toHexString()
        })
        .expect(404)
})

it('returns a 401 when purchasing an order that doesnt belong to the user', async () => {
    const order = await buildOrder(OrderStatus.Created)
    const currentUser = global.signin();
    await request(app)
    .post('/api/payments')
    .set('Cookie', currentUser)
    .send({
        token: 'randomToken',
        orderId: order.id
    })
    .expect(401)
})

it('returns a 400 when purchasing a cancelled order', async () => {
    //we need to pass the userId verification check first
    const userId = new mongoose.Types.ObjectId().toHexString()
    const order = await buildOrder(OrderStatus.Cancelled, userId)
    const currentUser = global.signin(userId);
    await request(app)
        .post('/api/payments')
        .set('Cookie', currentUser)
        .send({
            orderId: order.id,
            token: 'randomToken'
        })
        .expect(400)
})

it('returns a 201 with valid inputs', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString()
    const price = Math.floor(Math.random()*2000)
    const order = await buildOrder(OrderStatus.Created, userId, price)
    const currentUser = global.signin(userId)
    await request(app)
        .post('/api/payments')
        .set('Cookie', currentUser)
        .send({
            orderId: order.id,
            token: 'tok_visa'
        })
        .expect(201)

    //real Stripe API test suite (uncomment if you want to use jest.Mock)
    const stripeCharges = await stripe.charges.list({ limit: 50})

    const StripeChargesClean = stripeCharges.data.map(charge => charge.amount)
    console.log('StripeChargesClean', StripeChargesClean)
    const stripeCharge = stripeCharges.data.find(charge => {
        return charge.amount === price*100
    })

    expect(stripeCharge).toBeDefined()
    expect(stripeCharge!.currency).toEqual('twd')

    const payment = await Payment.findOne({
        orderId: order.id,
        stripeId: stripeCharge!.id
    })
    //payment value will be null if its not found
    expect(payment).not.toBeNull()
    
    /**
     * below use jest.mock to test stripe function
     * to activate these tests
     * comment out jest.mock("../stripe/stripe.ts") line in setup.ts
     * rename stripe.ts.old in stripe/__mocks__/ to stripe.ts
     * then comment out the stripe API test suite above
     * finally comment out the codes below
     */
    // expect(stripe.charges.create).toHaveBeenCalled()
    // // @ts-ignore
    // const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0]
    // console.log('chargeOptions', chargeOptions)
    // expect(chargeOptions.source).toEqual('tok_visa')
    // expect(chargeOptions.amount).toEqual(order.price * 100)
    // expect(chargeOptions.currency).toEqual('twd')
})

