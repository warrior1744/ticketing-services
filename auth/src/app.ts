import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'

import cookieSession from 'cookie-session'

import { currentUserRouter } from './routes/current-user'
import { usersrRouter } from './routes/users'
import { signinRouter } from './routes/signin'
import { signoutRouter } from './routes/signout'
import { signupRouter } from './routes/signup'
import { errorHandler, NotFoundError } from '@jimtickets/common'


const app = express()
app.set('trust proxy', true) //traffic proxied through ingress nginx
app.use(json())
app.use(
    cookieSession({
        signed: false, //disable encryption (commonly used)
        secure: process.env.NODE_ENV !== 'test' //use https connection
    })
)

app.use(currentUserRouter)
app.use(usersrRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

app.get('*', async (req, res) => {
    throw new NotFoundError()
})

app.use(errorHandler)

export { app }