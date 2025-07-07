import type { ITransformerConstructor, Transformer } from '../transformer'
import type { TransformerField } from '../type'
import { DecoratorUtil } from '../util'

/**
 * ### KEY
 */
const KEY = '[Type]'

/**
 * ### 数组KEY
 */
const KEY_ARRAY = '[Array]'

/**
 * ### 为属性配置强制类型
 * @param type 强制转换的类型
 * @param array 是否固定数组
 */
export function Type<
  T extends Transformer,
  TO extends Transformer,
>(
  type: ITransformerConstructor<TO>,
  array = false,
) {
  return (
    instance: T,
    field: keyof T,
  ) => {
    DecoratorUtil.setFieldConfig(instance, field, KEY, type)
    if (array) {
      DecoratorUtil.setFieldConfig(instance, field, KEY_ARRAY, array)
    }
  }
}

/**
 * ### 获取属性的强制类型
 * @returns 别名
 * @param Class 目标类
 * @param field 属性名
 */
export function getType<
  T extends Transformer,
  TO extends Transformer,
>(
  Class: ITransformerConstructor<T>,
  field: TransformerField<T>,
): ITransformerConstructor<TO> | undefined {
  return DecoratorUtil.getFieldConfig(Class, field, KEY) || undefined
}

/**
 * ### 获取属性是否强制数组
 * @returns 别名
 * @param Class 目标类
 * @param field 属性名
 */
export function getArray<
  T extends Transformer,
>(
  Class: ITransformerConstructor<T>,
  field: TransformerField<T>,
): boolean {
  return !!DecoratorUtil.getFieldConfig(Class, field, KEY_ARRAY)
}
