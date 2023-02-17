import express, { Request, Response } from "express"
import { User } from "../models/user"
import { requireAuth, NotFoundError,currentUser } from "@jimtickets/common"

const router = express.Router()

router.get("/api/users", currentUser, requireAuth, async (req: Request, res: Response) => {
    const users = await User.find({})

    if(!users){
        throw new NotFoundError('no users found')
    }
    res.send(users)
})

export { router as usersrRouter}