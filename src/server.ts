import { app } from './app'
import { ENV } from './env'

app
  .listen({ port: ENV.PORT })
  .then((url) => console.log(`HTTP Server Running at ${url}`))
