import type { IJson, ITransformerConstructor, Transformer } from '../transformer'
import type { TransformerField } from '../type'
import { DecoratorUtil } from '../util'

const KEY = '[ToClass]'

/**
 * ### 自定义转换到 `Class` 的方法
 * @param func 方法
 */
export function ToClass<
  T extends Transformer,
>(
  func: (json: IJson) => unknown,
) {
  return (
    instance: T,
    field: keyof T,
  ) => DecoratorUtil.setFieldConfig(instance, field, KEY, func)
}

/**
 * ### 获取自定义转换到 `Class` 的方法
 * @param target 目标类
 * @param field 属性名
 */
export function getToClass<
  T extends Transformer,
>(
  target: ITransformerConstructor<T>,
  field: TransformerField<T>,
): (
    json: IJson
  ) => unknown {
  return DecoratorUtil.getFieldConfig(target, field, KEY)
}
