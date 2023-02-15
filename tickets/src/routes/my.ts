import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.get("/api/tickets/my", async (req: Request, res: Response) => {
  //only find tickets with the currentUser's
  const tickets = await Ticket.find({
    userId: req.currentUser?.id
  });
  res.send(tickets)
});

export { router as myTicketRouter };
