import type { ITransformerConstructor } from '../transformer'
import type { DecoratorData, TransformerField } from '../type'
import { Transformer } from '../transformer'

/**
 * ### 装饰器工具类
 *
 * @author Hamm.cn
 */
export class DecoratorUtil {
  /**
   * ### 设置一个类配置项
   * @param Class 目标类
   * @param classConfigKey 配置项索引键值
   * @param classConfig 配置的参数
   */
  static setClassConfig<
    T extends Transformer,
  >(
    Class: ITransformerConstructor<T>,
    classConfigKey: string,
    classConfig: unknown,
  ): void {
    this.setProperty(Class.prototype, classConfigKey, classConfig)
  }

  /**
   * ### 递归获取指定类的配置项
   * @param Class 目标类
   * @param classConfigKey 配置项的Key
   * @param isObject `可选` 是否是对象配置
   */
  static getClassConfig<
    T extends Transformer,
  >(
    Class: ITransformerConstructor<T>,
    classConfigKey: string,
    isObject = false,
  ): DecoratorData {
    let classConfig: any = Reflect.get(new Class(), classConfigKey)
    const SuperClass = Reflect.getPrototypeOf(Class) as (ITransformerConstructor<T> | null)
    if (!isObject) {
      // 普通配置
      if (classConfig) {
        return classConfig
      }
      if (!SuperClass || SuperClass.prototype.constructor.name === Transformer.name) {
        return undefined
      }
      return this.getClassConfig(SuperClass, classConfigKey)
    }

    classConfig = classConfig || {}
    // 对象配置
    if (!SuperClass || SuperClass.prototype.constructor.name === Transformer.name) {
      return classConfig
    }

    return {
      ...this.getClassConfig(SuperClass, classConfigKey, isObject),
      ...classConfig,
    }
  }

  /**
   * ### 设置一个属性配置项
   * @param instance 目标实例
   * @param field 属性
   * @param fieldConfigKey 配置项索引键值
   * @param fieldConfig 配置的参数
   */
  static setFieldConfig<
    T extends Transformer,
  >(
    instance: T,
    field: keyof T,
    fieldConfigKey: string,
    fieldConfig: unknown,
  ): void {
    this.setProperty(instance, `${fieldConfigKey}[${field.toString()}]`, fieldConfig)
  }

  /**
   * ### 获取类指定属性的指定类型的配置
   * @param Class 目标类
   * @param field 属性
   * @param fieldConfigKey FieldConfigKey
   * @param isObject `可选` 是否对象配置
   */
  static getFieldConfig<
    T extends Transformer,
  >(
    Class: ITransformerConstructor<T>,
    field: TransformerField<T>,
    fieldConfigKey: string,
    isObject = false,
  ): DecoratorData {
    let fieldConfig: any = Reflect.get(new Class(), `${fieldConfigKey}[${field.toString()}]`)
    const SuperClass = Reflect.getPrototypeOf(Class) as (ITransformerConstructor<T> | null)
    if (!isObject) {
      // 普通配置
      if (fieldConfig !== undefined) {
        return fieldConfig
      }
      // 没有查询到配置
      if (!SuperClass || SuperClass.prototype.constructor.name === Transformer.name) {
        return undefined
      }
      return this.getFieldConfig(SuperClass, field, fieldConfigKey)
    }

    // 对象配置
    fieldConfig = fieldConfig || {}
    // 没有查询到配置
    if (!SuperClass || SuperClass.prototype.constructor.name === Transformer.name) {
      return fieldConfig
    }
    return {
      ...this.getFieldConfig(SuperClass, field, fieldConfigKey, true),
      ...fieldConfig,
    }
  }

  /**
   * ### 反射添加属性
   * @param instance 目标属性
   * @param propertyKey 配置key
   * @param value 配置值
   */
  private static setProperty<
    T extends Transformer,
  >(
    instance: T,
    propertyKey: string,
    value: unknown,
  ): void {
    Reflect.defineProperty(instance, propertyKey, {
      enumerable: false,
      value,
      writable: false,
      configurable: true,
    })
  }
}
