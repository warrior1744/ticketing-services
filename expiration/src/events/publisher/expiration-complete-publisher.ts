import { Subjects, Publisher, ExpirationCompleteEvent } from '@jimtickets/common'


export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete
}