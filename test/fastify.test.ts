/* eslint-disable @typescript-eslint/no-empty-function */

import fastify, {FastifyReply, FastifyRequest} from 'fastify'
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
