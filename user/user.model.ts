import * as mongoose from 'mongoose'

interface User extends mongoose.Document{
    name: String
    email: String
    password: String
}

const UserSchema = new mongoose.Schema({
    name:{
        type: String
    },
    email:{
        type: String,
        unique: true
    },
    password:{
        type: String,
        select: false
    }
})

export const User = mongoose.model<User>('User', UserSchema)