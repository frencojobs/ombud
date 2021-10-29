import {FastifyPluginAsync} from 'fastify'
import proxy from 'fastify-http-proxy'
import 'reflect-metadata'
import {Methods} from 'trouter'
import {URL} from 'url'
import {Router} from './decorators/handlers.decorator'
import {Keys} from './decorators/keys'

// eslint-disable-next-line
type Instantiable = {new (...args: any[]): any}

export function setup(controller: Instantiable): FastifyPluginAsync {
  const options = Reflect.getMetadata(Keys.CONTROLLER_OPTIONS, controller)
  const router: Router = Reflect.getMetadata(Keys.ROUTER, controller)

  return async (fastify) => {
    const instance = new controller(fastify)

    fastify.register(proxy, {
      ...options,
      preHandler: async (request, reply) => {
        const url = new URL(request.url, options.upstream)

        const {params, handlers} = router.find(
          request.method as Methods,
          url.pathname
        )

        if (handlers[0]) {
          request.params = params
          await instance[handlers[0]](request, reply)
        }
      }
    })
  }
}

export {Controller} from './decorators/controller.decorator'
export * from './decorators/handlers.decorator'
