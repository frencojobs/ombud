/* eslint-disable @typescript-eslint/no-empty-function */

import fastify, {FastifyInstance, FastifyReply, FastifyRequest} from 'fastify'
import {Controller, Get, setup} from '../src'

test('`params` are passed to fastify', async () => {
  @Controller('http://localhost:8080')
  class Proxy {
    @Get('/params/:id')
    async params(request: FastifyRequest, reply: FastifyReply) {
      return reply.code(200).send(request.params)
    }
  }

  const server = fastify()
  server.register(setup(Proxy))
  const response = await server.inject({method: 'GET', path: '/params/1'})

  expect(response.statusCode).toEqual(200)
  expect(response.json()).toEqual({id: '1'})
})

test('properties like `headers` are not disrupted', async () => {
  @Controller('http://localhost:8080')
  class Proxy {
    @Get('/headers')
    async public(request: FastifyRequest, reply: FastifyReply) {
      return reply.code(200).send(request.headers['x-api-key'])
    }
  }

  const server = fastify()
  server.register(setup(Proxy))
  const response = await server.inject({
    method: 'GET',
    path: '/headers',
    headers: {'X-API-KEY': 'CAT'}
  })

  expect(response.statusCode).toEqual(200)
  expect(response.body).toEqual('CAT')
})

type Fastify = FastifyInstance & Record<string, unknown>

test('fastify instance is passed', async () => {
  @Controller('http://localhost:8080')
  class Proxy {
    constructor(private readonly fastify: Fastify) {}

    @Get('/decorators')
    async public(_: FastifyRequest, reply: FastifyReply) {
      return reply.code(200).send(this.fastify.foo)
    }
  }

  const server = fastify()
  server.decorate('foo', 'bar')
  server.register(setup(Proxy))
  const response = await server.inject({method: 'GET', path: '/decorators'})

  expect(response.statusCode).toEqual(200)
  expect(response.body).toEqual('bar')
})

test('simple authentication test', async () => {
  @Controller('http://localhost:8080')
  class Proxy {
    @Get('/public')
    async public(_: FastifyRequest, reply: FastifyReply) {
      return reply.code(200).send({success: true})
    }

    @Get('/private')
    async private(_: FastifyRequest, reply: FastifyReply) {
      return reply.code(401).send({success: false})
    }
  }

  const server = fastify()
  server.register(setup(Proxy))

  const pub = await server.inject({method: 'GET', path: '/public'})
  expect(pub.statusCode).toEqual(200)
  expect(pub.json()).toEqual({success: true})

  const priv = await server.inject({method: 'GET', path: '/private'})
  expect(priv.statusCode).toEqual(401)
  expect(priv.json()).toEqual({success: false})
})
