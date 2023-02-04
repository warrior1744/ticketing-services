import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from '../../models/order'
import { natsWrapper } from "../../nats/nats-wrapper";

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

it("marks an order as cancelled", async () => {
  const ticket = await buildTicket();
  const currentUser = global.signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", currentUser)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", currentUser)
    .send()
    .expect(204);

    //check if its cancelled
  const updatedOrder = await Order.findById(order.id)
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
});

it('emits an order cancelled event', async () => {
  const ticket = await buildTicket();
  const currentUser = global.signin();

  const {body: order} = await request(app)
    .post('/api/orders')
    .set('Cookie', currentUser)
    .send({ ticketId: ticket.id })
    .expect(201)

  await request(app)
      .delete(`/api/orders/${order.id}`)
      .set('Cookie', currentUser)
      .send()
      .expect(204)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
  // @ts-ignore
  console.log(natsWrapper.client.publish.mock.calls)
})

