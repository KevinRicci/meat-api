import * as restify from 'restify'
import * as mongoose from 'mongoose'
import { environment } from '../common/environment'
import { mergePatchJsonParser } from './merge-patch.parser'
import { errorHandler } from './error.handler'
import {usersRouter} from '../user/users.router'

export class Server {
    public application: restify.Server

    public initializeDB(): Promise<mongoose.Mongoose> {
        (<any>mongoose.Promise) = global.Promise
        return mongoose.connect(environment.db.url, {
            useMongoClient: true
        })
    }

    public initRoutes(): Promise<restify.Server> {
        return new Promise((resolve, reject) => {
            try {
                this.application = restify.createServer({
                    name: 'meat-api',
                    version: '1.0.0'
                })

                this.application.use(restify.plugins.queryParser())
                this.application.use(restify.plugins.bodyParser())
                this.application.use(mergePatchJsonParser)
                this.application.on('restifyError', errorHandler)

                //attaching routes to application
                usersRouter.applyRoutes(this.application)

                this.application.listen(environment.server.port, () => {
                    console.log('Server is up on localhost:' + environment.server.port)
                    resolve(this.application)
                })

            } catch (err) {
                reject(err)
            }
        })
    }

    public bootstrap(): Promise<restify.Server> {
        return this.initializeDB().then(() => {
            return this.initRoutes()
        })
    }
}