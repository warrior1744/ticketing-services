import { Publisher } from "@jimtickets/common";
import { TicketCreatedEvent } from "@jimtickets/common";
import { Subjects } from "@jimtickets/common";


export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated
}