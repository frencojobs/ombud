import {FastifyHttpProxyOptions} from 'fastify-http-proxy'
import {Keys} from './keys'

export const Controller = (
  upstream: string,
  options?: Omit<FastifyHttpProxyOptions, 'upstream' | 'preHandler'>
): ClassDecorator => {
  return (target) => {
    Reflect.defineMetadata(
      Keys.CONTROLLER_OPTIONS,
      {upstream, ...(options ?? {})},
      target
    )
  }
}
