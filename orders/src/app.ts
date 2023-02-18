import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'

import { createOrderRouter } from './routes/new'
import { showOrderRouter } from './routes/show'
import { indexOrderRouter } from './routes'
import { deleteOrderRouter } from './routes/delete'

import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError, currentUser } from '@jimtickets/common'

const app = express()
app.set('trust proxy', true) //traffic proxied through ingress nginx
app.use(json())
app.use(
    cookieSession({
        signed: false, //disable encryption (commonly used)
        secure: false, //process.env.NODE_ENV !== 'test' //use https connection
    })
)
app.use(currentUser)
app.use(createOrderRouter)
app.use(showOrderRouter)
app.use(indexOrderRouter)
app.use(deleteOrderRouter)

app.get('*', async (req, res) => {
    throw new NotFoundError()
})

app.use(errorHandler)

export { app }