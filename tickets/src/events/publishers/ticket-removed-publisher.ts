import { Publisher, Subjects, TicketRemovedEvent } from '@jimtickets/common'

export class TicketRemovedPublisher extends Publisher<TicketRemovedEvent> {
    readonly subject = Subjects.TicketRemoved
}