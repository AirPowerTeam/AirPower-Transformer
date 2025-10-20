import type { ITransformerConstructor, Transformer } from '../transformer'
import type { TransformerField } from '../type'
import { DecoratorUtil } from '../util'

/**
 * ### KEY
 */
const KEY: string = '[IgnorePrefix]'

/**
 * ### 属性忽略前缀
 */
export function IgnorePrefix<
  T extends Transformer,
>(): (instance: T, field: keyof T) => void {
  return (
    instance: T,
    field: keyof T,
  ): void => DecoratorUtil.setFieldConfig(instance, field, KEY, true)
}

/**
 * ### 获取属性是否忽略前缀
 * @returns 布尔
 * @param Class 目标类
 * @param field 属性名
 */
export function getIgnorePrefix<T extends Transformer>(
  Class: ITransformerConstructor<T>,
  field: TransformerField<T>,
): boolean {
  return !!DecoratorUtil.getFieldConfig(Class, field, KEY)
}
