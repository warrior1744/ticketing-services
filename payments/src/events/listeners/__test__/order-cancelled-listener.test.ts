import { natsWrapper } from "../../../nats/nats-wrapper";
import { OrderCancelledEvent, OrderStatus } from "@jimtickets/common";
import mongoose from "mongoose";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";

const setup = async () => {
    //create an instance of the listener
    const listener = new OrderCancelledListener(natsWrapper.client)
    //create an order manually
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        price: 200,
        userId: 'someUser',
        version: 0
    })
    await order.save()

    //create a fake data event (a published event)
    const data: OrderCancelledEvent['data'] = {
        version: order.version+1,
        id: order.id,
        ticket: {
            id: 'validId'
        }
    }
    //create a fake message object
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg, order}
}

it('updates the status of the order', async () => {
    const { listener, data, msg, order} = await setup()
    await listener.onMessage(data, msg)
    const updatedOrder = await Order.findById(order.id)
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)

})

it('acks the message', async () => {
    const { listener, data, msg} = await setup()
    await listener.onMessage(data, msg)
    expect(msg.ack).toBeCalled()
})