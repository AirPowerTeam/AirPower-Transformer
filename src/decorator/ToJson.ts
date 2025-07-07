import type { ITransformerConstructor, Transformer } from '../transformer'
import type { TransformerField } from '../type'
import { DecoratorUtil } from '../util'

const KEY = '[ToJson]'

/**
 * ### 自定义转换到 `JSON` 的方法
 * @param func 方法
 */
export function ToJson<
  T extends Transformer,
>(func: (
  instance: T
) => unknown) {
  return (
    instance: T,
    key: keyof T,
  ) => DecoratorUtil.setFieldConfig(instance, key, KEY, func)
}

/**
 * ### 获取自定义转换到 `JSON` 的方法
 * @param Class 目标类
 * @param field 属性名
 */
export function getToJson<
  T extends Transformer,
>(
  Class: ITransformerConstructor<T>,
  field: TransformerField<T>,
): (
  instance: T
) => unknown {
  return DecoratorUtil.getFieldConfig(Class, field, KEY)
}
