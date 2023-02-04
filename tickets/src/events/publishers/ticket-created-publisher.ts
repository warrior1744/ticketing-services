import { Publisher, Subjects, TicketCreatedEvent } from '@jimtickets/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}