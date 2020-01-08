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

    public renderAll(response: restify.Response, next: restify.Next): any{
        return (documents: any[]) => {
            if(documents){
                documents.forEach(doc =>{
                    this.emit('beforeRender', doc)
                })
                response.json(documents)
                return next()
            }else{
                response.json([])
                return next()
            }
        }
    }
}