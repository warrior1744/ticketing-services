import { Message } from "node-nats-streaming";
import {
  Listener,
  Subjects,
  TicketUpdatedEvent,
  NotFoundError,
} from "@jimtickets/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const { title, price, image } = data;
    const ticket = await Ticket.findByEvent(data)
    if (!ticket) {
      throw new NotFoundError('Ticket Listener: Ticket Not Found');
    }

    ticket.set({
      title,
      price,
      image
    });
    await ticket.save();

    msg.ack();
  }
}
