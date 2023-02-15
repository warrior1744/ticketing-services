import express, { Request, Response } from "express";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
} from "@jimtickets/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { natsWrapper } from "../nats/nats-wrapper";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title must not be empty"),
    body("price").isInt({ gt: 0 }).withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (ticket.orderId) {
      throw new BadRequestError(
        "Unable to update, ticket is Reserved by an order"
      );
    }

    ticket.set({
      title: req.body.title,
      price: req.body.price,
      image: req.body.image,
    });

    await ticket.save();

    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      image: ticket.image,
    });

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
