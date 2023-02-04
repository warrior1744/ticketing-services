import { Listener } from "@jimtickets/common"
import { Message } from "node-nats-streaming";
import { TicketCreatedEvent } from "@jimtickets/common";
import { Subjects } from "@jimtickets/common";


export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated
    queueGroupName = 'payments-service'
    onMessage(data: TicketCreatedEvent['data'], msg: Message){
        console.log('Event data!', data)
        console.log(data.id)
        console.log(data.title)
        console.log(data.price)
        msg.ack()
    }
}

