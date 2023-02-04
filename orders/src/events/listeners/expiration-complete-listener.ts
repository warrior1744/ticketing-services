import { Listener, ExpirationCompleteEvent, Subjects, NotFoundError, OrderStatus} from "@jimtickets/common"
import { queueGroupName } from "./queue-group-name"
import { Message } from "node-nats-streaming"
import { Order } from "../../models/order"
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher"
import { natsWrapper } from "../../nats/nats-wrapper"

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete
    queueGroupName = queueGroupName

    async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
        const order = await Order.findById(data.orderId).populate('ticket')
        if (!order) {
            throw new NotFoundError('Expiration Complete Listener: Order Not Found');
        }

        //check if the order is complete (paid), then stop right here to prevent further cancelled codes
        if(order.status === OrderStatus.Complete){
            return msg.ack()
        }

        order.set({
            status: OrderStatus.Cancelled,
            /*we still need ticket info because ticket service need a 
              reference of the order's status cancelled or not
            */
        })
        await order.save()

        // publishing an event saying the order was cancelled
        await new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id,
            ticket: {
                id: order.ticket.id
            },
            version: order.version
        })

        msg.ack();
    }
}