import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@jimtickets/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats/nats-wrapper";

const router = express.Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title must not be empty"),
    body("price").isInt({ gt: 0 }).withMessage("Price must be greater than 0 and no decimal"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ticket = Ticket.build({ 
        title, 
        price, 
        userId: req.currentUser!.id,
        image: '/images/event-default.png'
    });
    await ticket.save()

    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      image: ticket.image
    })
    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
