import proxy from '@fastify/http-proxy'
import type {FastifyPluginAsync} from 'fastify'
import 'reflect-metadata'
import type {Methods} from 'trouter'
import {URL} from 'url'

import {getControllerMetadata} from './decorators/controller.decorator'
import {getRouterMetadata} from './decorators/handlers.decorator'
import type {ConstructableController, DecoratedMethod} from './types'

export function setup<T extends ConstructableController>(
  controller: T,
): FastifyPluginAsync {
  const options = getControllerMetadata(controller)
  const router = getRouterMetadata(controller)

  return async (fastify) => {
    // make it indexable
    const instance = new controller(fastify) as Record<string, DecoratedMethod>

    // register the plugin
    await fastify.register(proxy, {
      ...options,
      preHandler: (request, reply) => {
        // find the handlers in the router
        const url = new URL(request.url, options.upstream)
        const {params, handlers} = router.find(
          request.method as Methods,
          url.pathname,
        )

        // get handler
        const handler = handlers[0] ? instance[handlers[0]] : undefined

        // execute
        if (handler) {
          request.params = params
          void handler.bind(instance)(request, reply)
        }
      },
    })
  }
}
