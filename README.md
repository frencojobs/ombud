# Ombud

Ombud (Swedish word for proxy, pronounced `/ˈɒmbəd/`) is a tiny utility library for making proxy servers with [fastify-http-proxy](https://github.com/fastify/fastify-http-proxy). The library acts as an abstraction layer to manage routes more efficiently using TypeScript's experimental decorators.

## Overview

A simple proxy server with route based authorization will look like this.

```ts
import {Controller, Get, All} from 'ombud'

@Controller('https://example.com')
class Proxy {
  @Get('/public')
  async pub() {}

  @Get('/private')
  @All('/user/:id')
  async auth(request: FastifyRequest, reply: FastifyReply) {
    return reply.code(401).send('unauthorized')
  }
}
```

## Usage

1. Install required dependencies.

```
npm i ombud fastify reflect-metadata
```

2. Make sure to import `reflect-metadata` shim once before using the decorators.

```ts
import 'reflect-metadata'
```

3. Create a proxy server controller.

```ts
import {Controller, Get, All} from 'ombud'

@Controller('https://example.com', {proxyPaylods: false}) // all the options for fastify-http-proxy are available via second param
export class Proxy {
  // if you want to consume `fastify` instance from controller
  // set a constructor like this
  constructor(private readonly fastify: FastifyInstance) {}

  @Get('/public')
  async pub() {}

  @Get('/private')
  @All('/user/:id')
  async auth(request: FastifyRequest, reply: FastifyReply) {
    return reply.code(401).send('unauthorized')
  }

  // all other routes will be allowed by default
  // to disable that behavior, use a wildcard
  @All('*')
  async others() {}
}
```

4. Register the controller to a fastify server.

```ts
import fastify from 'fastify'
import {setup} from 'ombud'

// ...

const server = fastify()
server.register(setup(Proxy))

server.listen(3000)
```

## Acknowledgements

This library was inspired by [NestJS](https://nestjs.com) & [typestack/routing-controllers](https://github.com/typestack/routing-controllers).
