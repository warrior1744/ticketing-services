import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError, currentUser } from '@jimtickets/common'
import { createChargeRouter } from './routes/new'

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
app.use(createChargeRouter)

app.get('*', async (req, res) => {
    throw new NotFoundError()
})

app.use(errorHandler)

export { app }