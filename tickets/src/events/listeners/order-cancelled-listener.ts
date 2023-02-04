import { Message } from "node-nats-streaming"
import { Listener, Subjects, OrderCancelledEvent, OrderStatus,   NotFoundError } from "@jimtickets/common"
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";


export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled
    queueGroupName = queueGroupName

    async onMessage(data: OrderCancelledEvent['data'], msg: Message){
        const ticket = await Ticket.findById(data.ticket.id)
        if(!ticket){
            throw new NotFoundError('order-cancelled-listener: Ticket Not Found');
        }

        ticket.set({ orderId: undefined}) //set its orderId property (unreserve the ticket)
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