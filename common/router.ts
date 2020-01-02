import * as restify from 'restify'
import {EventEmitter} from 'events'

export abstract class Router extends EventEmitter{
    abstract applyRoutes(application: restify.Server)

    public render(response: restify.Response, next: restify.Next): any{
        return (document) =>{
            if(document){
                this.emit('beforeRender', document)
                response.json(document)
                return next()
            }else{
                response.send(404)
                return next()
            }
        }
    }
}