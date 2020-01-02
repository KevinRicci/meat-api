import * as restify from 'restify'
import {BadRequestError} from 'restify-errors'

const mpContentType = 'application/merge-patch+json'

export const mergePatchJsonParser = (req: restify.Request, resp: restify.Response, next: restify.Next) =>{
    if(req.contentType() == mpContentType && req.method == 'PATCH'){
        try{
            const rawBody = req.body
            req.body = JSON.parse(req.body)
            return next()
        }catch(e){
            return next(new BadRequestError(e.message))
        }
    }else{
        return next()
    }
}