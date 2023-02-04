import { Publisher, Subjects, OrderCancelledEvent } from "@jimtickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled
}