import { Message } from "node-nats-streaming"
import { Listener, Subjects, OrderCreatedEvent, OrderStatus,   NotFoundError } from "@jimtickets/common"
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated
    queueGroupName = queueGroupName

    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id)
        if(!ticket){
            throw new NotFoundError('Order Listener: Ticket Not Found');
        }

        ticket.set({ orderId: data.id}) //set its orderId property (reserve the ticket)
        await ticket.save()
        //emit an event after updated the ticket
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version
        })

        msg.ack()
    }
}