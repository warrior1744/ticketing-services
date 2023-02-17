import mongoose from 'mongoose'
import { app } from './app'

const start = async () => {
    console.log('Auth Service Starting up ...')
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY is not defined')
    }

    if(!process.env.MONGO_URI){
        throw new Error('MONGO_URI is not defined')  
    }

    try {
        await mongoose.connect(process.env.MONGO_URI )
    }catch (err) {
        console.error(err)
    }

    app.listen(3000, () => {
        console.log('Version 1.01')
        console.log('Listening on port 3000!')
    }) 
}

start()


