import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'

import { createTicketRouter } from './routes/new'
import { showTicketRouter } from './routes/show'
import { indexTicketRouter } from './routes'
import { updateTicketRouter } from './routes/update'

import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError, currentUser } from '@jimtickets/common'

const app = express()
app.set('trust proxy', true) //traffic proxied through ingress nginx
app.use(json())
app.use(
    cookieSession({
        signed: false, //disable encryption (commonly used)
        secure: process.env.NODE_ENV !== 'test' //use https connection
    })
)
app.use(currentUser)
app.use(createTicketRouter)
app.use(showTicketRouter)
app.use(indexTicketRouter)
app.use(updateTicketRouter)

app.get('*', async (req, res) => {
    throw new NotFoundError()
})

app.use(errorHandler)

export { app }