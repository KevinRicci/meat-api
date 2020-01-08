import { Router } from './router'
import { NotFoundError, BadRequestError } from 'restify-errors'
import * as mongoose from 'mongoose'

export abstract class ModelRouter<T extends mongoose.Document> extends Router {
    constructor(protected specificRouter: mongoose.Model<T>) {
        super()
    }

    validateId = (req, resp, next) =>{
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            next(new BadRequestError('id not valid.'))
        }else{
            next()
        }
    }

    findAll = (req, resp, next) =>{
        this.specificRouter.find().then(this.renderAll(resp, next)).catch(next)
    }

    findById = (req, resp, next) =>{
        this.specificRouter.findById(req.params.id).then(this.render(resp, next)).catch(next)
    }

    save = (req, resp, next) =>{
        const document = new this.specificRouter(req.body)
        document.save().then(this.render(resp, next)).catch(next)
    }

    replace = (req, resp, next) =>{
        const options = { overwrite: true }
        this.specificRouter.update({ _id: req.params.id }, req.body, options)
            .exec().then(result => {
                if (result.n) {
                    return this.specificRouter.findById(req.params.id)
                } else {
                    throw new NotFoundError(`${this.specificRouter.collection.collectionName} not found`)
                }
            }).then(this.render(resp, next).catch(next))
    }

    update = (req, resp, next) =>{
        const options = { new: true }
        this.specificRouter.findByIdAndUpdate(req.params.id, req.body, options).then(this.render(resp, next)).catch(next)
    }

    delete = (req, resp, next) =>{
        this.specificRouter.remove({ _id: req.params.id }).exec().then((cmdResult: any) => {
            if (cmdResult.result.n) {
                resp.send(204)
                return next()
            } else {
                throw new NotFoundError(`${this.specificRouter.collection.collectionName} not found`)
            }
        }).catch(next)
    }
}
