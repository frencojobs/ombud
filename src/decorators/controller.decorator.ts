import type {FastifyHttpProxyOptions} from '@fastify/http-proxy'

export const CONTROLLER_METADATA: unique symbol = Symbol()
export const getControllerMetadata = <T>(target: T) =>
  Reflect.getMetadata(CONTROLLER_METADATA, target) as FastifyHttpProxyOptions

export const Controller = (
  upstream: string,
  options?: Omit<FastifyHttpProxyOptions, 'upstream' | 'preHandler'>,
): ClassDecorator => {
  return (target) => {
    Reflect.defineMetadata(
      CONTROLLER_METADATA,
      {upstream, ...(options ?? {})},
      target,
    )
  }
}
