import * as mongoose from 'mongoose'
import CPF, { validate } from 'cpf-check'
import * as bcryptjs from 'bcryptjs'
import {environment} from '../common/environment'

interface User extends mongoose.Document{
    name: String
    email: String
    password: String
}

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        maxlength: 80,
        minlength: 3
    },
    email:{
        type: String,
        unique: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        required: true
    },
    password:{
        type: String,
        select: false,
        required: true
    },
    gender:{
        type: String,
        required: true,
        enum: ['Male', 'Female']
    },
    cpf:{
        type: String,
        required: false,
        validate:{
            validator: CPF.validate,
            message: '{PATH}: Invalid CPF ({VALUE})'
        }
    }
})

UserSchema.pre('save', function(next){
    const user = <User>this
    if(!user.isModified('password')){
        return next()
    }else{
        const hash = bcryptjs.hashSync(user.password.toString(), environment.security.salts)
        user.password = hash
        return next()
    }
})

export const User = mongoose.model<User>('User', UserSchema)