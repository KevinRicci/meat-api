import {Server} from './server/server'

const server = new Server()

server.bootstrap().then(server =>{
    console.log(`Server's okay.`)
}).catch(err =>{
    console.error(err)
    process.exit(1)
})