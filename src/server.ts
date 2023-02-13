import fastify from "fastify";

const app = fastify({ logger: true })

app.get('/', () => {
  return 'Hello World'
})

app.listen({ port: 3333 }).then((url) => console.log(`HTTP Server Running at ${url}`))