import type { ITransformerConstructor, Transformer } from '../transformer'
import { DecoratorUtil } from '../util'

/**
 * ### KEY
 */
const KEY: string = '[Prefix]'

/**
 * ### 标记类转换的前缀
 * @param prefix 转换前缀
 */
export function Prefix<
  T extends Transformer,
>(
  prefix: string,
): (Class: ITransformerConstructor<T>) => void {
  return (
    Class: ITransformerConstructor<T>,
  ): void => DecoratorUtil.setClassConfig(Class, KEY, prefix)
}

/**
 * ### 获取类转换的前缀
 * @param Class 目标类
 */
export function getPrefix<
  T extends Transformer,
>(
  Class: ITransformerConstructor<T>,
): string {
  return DecoratorUtil.getClassConfig(Class, KEY) || ''
}
