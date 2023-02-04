import { Subjects, Publisher, PaymentCreatedEvent} from "@jimtickets/common";


export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated
}