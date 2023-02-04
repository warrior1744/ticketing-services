import { natsWrapper } from "../../../nats/nats-wrapper";
import { OrderStatus, ExpirationCompleteEvent } from "@jimtickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { Order } from "../../../models/order";
import { ExpirationCompleteListener } from "../expiration-complete-listener";

const setup = async () => {
  //create an instance of the listener
  const listener = new ExpirationCompleteListener(natsWrapper.client);
  //create and save a ticket for an order
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Michael Jackson concert",
    price: 200,
  });
  await ticket.save();
  //create and save an order
  const order = Order.build({
    userId: "someUser",
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket: ticket,
  });
  await order.save();
  //create a fake data event (a published event)
  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };
  //create a fake message object
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, order, ticket };
};

it("updates the order, status to be cancelled, and update the ticket", async () => {
  const { listener, data, msg, order, ticket } = await setup();
  //expect the order to be cancelled
  await listener.onMessage(data, msg);
  //write assertions to make sure the order status is cancelled
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder).toBeDefined();
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emit an OrderCancelled event", async () => {
  const { listener, data, msg, order, ticket } = await setup()
  await listener.onMessage(data, msg)

  expect(natsWrapper.client.publish).toHaveBeenCalled()

  //@ts-ignore
  console.log(natsWrapper.client.publish.mock.calls)
  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(eventData.id).toEqual(order.id)
});

it("act the message", async () => {
  const { listener, data, msg, order, ticket } = await setup();
  await listener.onMessage(data, msg)
  expect(msg.ack).toBeCalled()
});
