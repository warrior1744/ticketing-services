import mongoose from 'mongoose'
import { Password } from '../services/password'

// an interface that describes the properties that a User Document has
interface UserDoc extends mongoose.Document {
    username: string
    email: string
    password: string
}

// An interface that describes the properties that required to create a new user
interface UserAttrs {
    username: string
    email: string
    password: string
}

// an interface that describe userSchema
interface userModel extends mongoose.Model<UserDoc> {
    build: (attrs: UserAttrs) => UserDoc
}

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
   toJSON: {
     transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.password
     },
     versionKey: false
   } 
})

userSchema.pre('save', async function(done) {
    if (this.isModified('password')){
        const hashed = await Password.toHash(this.get('password'))
        this.set('password', hashed)
    }
    done()
})

//create a custom function built-in to the model
userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs)
}

const User = mongoose.model<UserDoc, userModel>('User', userSchema)

export { User }