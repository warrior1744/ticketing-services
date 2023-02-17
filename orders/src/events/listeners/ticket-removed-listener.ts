import { Message } from "node-nats-streaming";
import {
  Listener,
  Subjects,
  TicketRemovedEvent,
  NotFoundError,
} from "@jimtickets/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketRemovedListener extends Listener<TicketRemovedEvent> {
  readonly subject = Subjects.TicketRemoved;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketRemovedEvent["data"], msg: Message) {
    const { id } = data;
    const ticket = await Ticket.findByEvent(data);
    if (!ticket) {
      throw new NotFoundError(`Ticket Listener: Ticket ${id} Not Found`);
    }

    await ticket.remove();
    msg.ack();
  }
}
