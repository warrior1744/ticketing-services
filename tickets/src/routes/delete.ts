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
import { TicketRemovedPublisher } from "../events/publishers/ticket-removed-publisher";
import { natsWrapper } from "../nats/nats-wrapper";

const router = express.Router();

router.delete(
  "/api/tickets/:id",
  requireAuth,
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
        "Unable to remove, ticket is Reserved"
      );
    }

    await ticket.remove()

    await new TicketRemovedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        version: ticket.version
    })

    res.send({message: `Ticket ${ticket.id} has been successfully removed`})

  }
);

export { router as deleteTicketRouter}
