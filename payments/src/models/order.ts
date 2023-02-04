import mongoose from "mongoose";
import { OrderStatus } from "@jimtickets/common";
import { updateIfCurrentPlugin} from 'mongoose-update-if-current'

export { OrderStatus }

interface OrderAttrs {
    id: string,
    version: number;
    userId: string;
    status: OrderStatus;
    price: number;
}

export interface OrderDoc extends mongoose.Document {
    version: number;
    userId: string;
    status: OrderStatus;
    price: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build: (attrs: OrderAttrs) => OrderDoc
    findByEvent: (event: {id: string, version: number}) => Promise<OrderDoc | null>
}

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus), //restricting the schema for the enum values
    },
    price: {
        type: Number,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id
        }
    }
})

orderSchema.set('versionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.statics.build = (attr: OrderAttrs) => {
    return new Order({
        _id: attr.id,
        version: attr.version,
        userId: attr.userId,
        status: attr.status,
        price: attr.price
    })
}
orderSchema.statics.findByEvent = (event: {id: string, version: number}) => {
    return Order.findOne({
      _id: event.id,
      version: event.version - 1
    })
  }

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema)

export { Order}