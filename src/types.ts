import type {FastifyReply, FastifyRequest} from 'fastify'
import type Trouter from 'trouter'

export type Router = Trouter<string>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ConstructableController<T = unknown> = new (...args: any[]) => T

export type DecoratedMethod<T = unknown> = (
  request: FastifyRequest,
  reply: FastifyReply,
) => T | Promise<T>
