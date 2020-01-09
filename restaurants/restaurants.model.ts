import * as mongoose from 'mongoose'

export interface Restaurant extends mongoose.Document{
    name: String,
    menu: MenuItem[]
}

export interface MenuItem extends mongoose.Document{
    name: String,
    price: Number
}

const MenuSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    }
})

const RestaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    menu:{
        type: [MenuSchema],
        require: false,
        select: false,
        default: []
    }
})

export const Restaurant =  mongoose.model<Restaurant>('Restaurant', RestaurantSchema)