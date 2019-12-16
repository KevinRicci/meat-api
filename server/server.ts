import * as restify from 'restify'
import { environment } from '../common/environment'
import { userRouter } from '../user/user.router'
import * as mongoose from 'mongoose'
import {mergePatchJsonParser} from './merge-patch.parser'

export class Server {
    public application: restify.Server

    public initializeDB(): Promise<mongoose.Mongoose>{
        (<any>mongoose.Promise) = global.Promise
        return mongoose.connect(environment.db.url,{
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

                userRouter.applyRoutes(this.application)

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
        return this.initializeDB().then(()=>{
            return this.initRoutes()
        })
    }
}