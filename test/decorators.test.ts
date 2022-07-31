import {expect, test} from 'vitest'
import {
  All,
  Controller,
  Get,
  getControllerMetadata,
  setup as ombudSetup,
} from '../src'
import {getRouterMetadata} from '../src/decorators/handlers.decorator'

test('@Controller', () => {
  @Controller('http://localhost:8080')
  class Proxy {}

  // Replicated `setup` function for tests
  const setup: typeof ombudSetup = (controller) => {
    const options = getControllerMetadata(controller)
    expect(options).toMatchObject({upstream: 'http://localhost:8080'})

    return async () => {}
  }

  setup(Proxy)
})

test('@METHOD', () => {
  @Controller('http://localhost:8080')
  class Proxy {
    @Get('/public')
    async pub() {}

    @Get('/private')
    @All('/user/:id')
    async auth() {}
  }

  // Replicated `setup` function for tests
  const setup: typeof ombudSetup = (controller) => {
    const router = getRouterMetadata(controller)

    // routing
    expect(router.find('GET', '/public')).toEqual({
      params: {},
      handlers: ['pub'],
    })

    expect(router.find('GET', '/private')).toEqual({
      params: {},
      handlers: ['auth'],
    })

    expect(router.find('GET', '/user/1')).toEqual({
      params: {id: '1'},
      handlers: ['auth'],
    })

    expect(router.find('POST', '/user/1')).toEqual({
      params: {id: '1'},
      handlers: ['auth'],
    })

    return async () => {}
  }

  setup(Proxy)
})
