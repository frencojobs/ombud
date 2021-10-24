/* eslint-disable @typescript-eslint/no-empty-function */

import {All, Controller, Get, setup as ombudSetup} from '../src'
import {Router} from '../src/decorators/handlers.decorator'
import {Keys} from '../src/decorators/keys'

test('@Controller', () => {
  @Controller('https://example.com')
  class Proxy {}

  // Replicated `setup` function for tests
  const setup: typeof ombudSetup = (controller) => {
    const options = Reflect.getMetadata(Keys.CONTROLLER_OPTIONS, controller)
    expect(options).toMatchObject({upstream: 'https://example.com'})

    return async () => {}
  }

  setup(Proxy)
})

test('@METHOD', () => {
  @Controller('https://example.com')
  class Proxy {
    @Get('/public')
    async pub() {}

    @Get('/private')
    @All('/user/:id')
    async auth() {}
  }

  // Replicated `setup` function for tests
  const setup: typeof ombudSetup = (controller) => {
    const router: Router = Reflect.getMetadata(Keys.ROUTER, controller)

    // routing
    expect(router.find('GET', '/public')).toEqual({
      params: {},
      handlers: ['pub']
    })

    expect(router.find('GET', '/private')).toEqual({
      params: {},
      handlers: ['auth']
    })

    expect(router.find('GET', '/user/1')).toEqual({
      params: {id: '1'},
      handlers: ['auth']
    })

    expect(router.find('POST', '/user/1')).toEqual({
      params: {id: '1'},
      handlers: ['auth']
    })

    return async () => {}
  }

  setup(Proxy)
})
