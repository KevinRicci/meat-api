import * as mongoose from 'mongoose'
import * as restify from 'restify'
import {NotFoundError} from 'restify-errors'
import {ModelRouter} from '../common/model.router'
import {Restaurant} from './restaurants.model'

class RestaurantRouter extends ModelRouter<Restaurant>{
    constructor(){
        super(Restaurant)
    }

    public findMenu = (req, resp, next) =>{
        Restaurant.findById(req.params.id, "+menu").then(rest =>{
            if(!rest){
                next(new NotFoundError('restaurant not found.'))
            }else{
                this.renderAll(resp, next)(rest.menu)
                return next()
            }
        })
    }

    public replaceMenu = (req, resp, next) =>{
        Restaurant.findById(req.params.id, "+menu").then(rest =>{
            if(!rest){
                next(new NotFoundError('restaurant not found.'))
            }else{
                rest.menu = req.body
                rest.save().then(rest =>{
                    this.renderAll(resp,next)(rest.menu)
                }).catch(next)
                return next()
            }
        })
    }

    public applyRoutes(application: restify.Server){
        application.get('/restaurants', this.findAll)
        application.get('/restaurants/:id', [this.validateId, this.findById])
        application.post('/restaurants', this.save)
        application.put('/restaurants/:id', [this.validateId, this.replace])
        application.patch('/restaurants:/id', [this.validateId, this.update])
        application.del('/restaurants/:id', [this.validateId, this.delete])

        application.get('/restaurants/:id/menu', [this.validateId, this.findMenu])
        application.put('/restaurants/:id/menu', [this.validateId, this.replaceMenu])
    }
}

export const restaurantsRouter = new RestaurantRouter()