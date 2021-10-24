import Trouter, {Methods} from 'trouter'
import {Keys} from './keys'

export type Router = Trouter<string | symbol>

const methodDecoratorFactory = (method: Methods | 'ALL') => {
  return (path: string): MethodDecorator => {
    return (target, propertyKey) => {
      const controllerClass = target.constructor

      const router: Router = Reflect.hasMetadata(Keys.ROUTER, controllerClass)
        ? Reflect.getMetadata(Keys.ROUTER, controllerClass)
        : new Trouter()

      if (method === 'ALL') {
        router.all(path, propertyKey)
      } else {
        router.add(method, path, propertyKey)
      }

      Reflect.defineMetadata(Keys.ROUTER, router, controllerClass)
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
