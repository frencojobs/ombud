import {FastifyPluginAsync} from 'fastify'
import proxy from 'fastify-http-proxy'
import 'reflect-metadata'
import {Methods} from 'trouter'
import {Router} from './decorators/handlers.decorator'
import {Keys} from './decorators/keys'

// eslint-disable-next-line
type Instantiable = {new (...args: unknown[]): any}

export function setup(controller: Instantiable): FastifyPluginAsync {
  const instance = new controller()

  const options = Reflect.getMetadata(Keys.CONTROLLER_OPTIONS, controller)
  const router: Router = Reflect.getMetadata(Keys.ROUTER, controller)

  return async (fastify) => {
    fastify.register(proxy, {
      ...options,
      preHandler: async (request, reply) => {
        const {params, handlers} = router.find(
          request.method as Methods,
          request.url
        )

        if (handlers[0]) {
          await instance[handlers[0]]({...request, params}, reply)
        }
      }
    })
  }
}

export {Controller} from './decorators/controller.decorator'
export * from './decorators/handlers.decorator'
