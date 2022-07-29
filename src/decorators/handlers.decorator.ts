import Trouter, {Methods} from 'trouter'
import type {Router} from '../types'

export const ROUTER_METADATA: unique symbol = Symbol()
export const getRouterMetadata = <T>(target: T) =>
  Reflect.getMetadata(ROUTER_METADATA, target) as Router

const methodDecoratorFactory = (method: Methods | 'ALL') => {
  return (path: string): MethodDecorator => {
    return (target, propertyKey) => {
      const controller = target.constructor

      const router = Reflect.hasMetadata(ROUTER_METADATA, controller)
        ? getRouterMetadata(controller)
        : (new Trouter() as Router)

      if (method === 'ALL') {
        router.all(path, propertyKey as string)
      } else {
        router.add(method, path, propertyKey as string)
      }

      Reflect.defineMetadata(ROUTER_METADATA, router, controller)
    }
  }
}

export const Delete = methodDecoratorFactory('DELETE')
export const Get = methodDecoratorFactory('GET')
export const Head = methodDecoratorFactory('HEAD')
export const Patch = methodDecoratorFactory('PATCH')
export const Post = methodDecoratorFactory('POST')
export const Put = methodDecoratorFactory('PUT')
export const Options = methodDecoratorFactory('OPTIONS')
export const All = methodDecoratorFactory('ALL')
