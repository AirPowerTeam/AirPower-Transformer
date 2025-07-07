import type { IJson, ITransformerConstructor } from './index.ts'
import { getAlias, getArray, getIgnorePrefix, getPrefix, getToClass, getToJson, getType } from '../decorator'

/**
 * ### 转换器
 *
 * @author Hamm.cn
 */
export class Transformer {
  /**
   * ### 从 `JSON` 转换到当前类的对象
   * 会自动进行数据别名转换
   * @param json `JSON`
   */
  static fromJson<T extends Transformer>(this: ITransformerConstructor<T>, json: IJson = {}): T {
    return Transformer.parse<T>(json, this)
  }

  /**
   * ### 从 `JSON` 数组转换到当前类的对象数组
   * 会自动进行数据别名转换
   * @param jsonArray `JSON`数组
   */
  static fromJsonArray<T extends Transformer>(this: ITransformerConstructor<T>, jsonArray: IJson | IJson[] = []): T[] {
    const instanceList: T[] = []
    if (Array.isArray(jsonArray)) {
      for (let i = 0; i < jsonArray.length; i += 1) {
        instanceList.push(Transformer.parse(jsonArray[i], this))
      }
    }
    else {
      instanceList.push(Transformer.parse(jsonArray, this))
    }
    return instanceList
  }

  /**
   * ### 创建一个当前类的实例
   * @param Class 类
   * @param recoverBy `可选` 初始化用于覆盖对象实例的 `JSON`
   */
  static newInstance<T extends Transformer>(Class: ITransformerConstructor<T>, recoverBy?: IJson): T {
    const instance = new Class()
    if (recoverBy) {
      return instance.recoverBy(recoverBy)
    }
    return instance
  }

  /**
   * ### 转换 `JSON` 为实体
   * 会自动进行数据别名转换
   * @param json `JSON`
   * @param Class 实体类
   */
  static parse<T extends Transformer>(
    json: IJson = {},
    Class: ITransformerConstructor<T>,
  ): T {
    const instance = new Class()
    const fieldList = Object.keys(instance)
    for (const field of fieldList) {
      const jsonKey = this.getJsonKey(Class, field)
      const fieldData = json[jsonKey]
        ; (instance as IJson)[field] = fieldData

      const toClass = getToClass(Class, field)
      if (toClass !== undefined) {
        // 标记了手动转换到类实例的自定义方法
        try {
          ; (instance as IJson)[field] = toClass(json as IJson)
        }
        catch (e) {
          console.warn('ToClass Function Error', e)
          continue
        }
      }
      const FieldTypeClass = getType(Class, field)
      const isArray = getArray(Class, field)
      if (isArray) {
        // 是数组 循环转换
        const fieldValueList: IJson[] = []
        if (typeof fieldData === 'object' && Array.isArray(fieldData)) {
          for (let i = 0; i < fieldData.length; i += 1) {
            // 如果标记了类 需要递归处理
            if (FieldTypeClass) {
              fieldValueList[i] = this.parse(fieldData[i], FieldTypeClass)
            }
          }
        }
        ; (instance as IJson)[field] = fieldValueList
        continue
      }

      if (fieldData === undefined || fieldData === null) {
        // 属性值为非 undefined 和 null 时不转换
        continue
      }

      if (!FieldTypeClass) {
        // 无需强制转换
        continue
      }
      switch (FieldTypeClass.name) {
        case 'String':
          ; (instance as IJson)[field] = fieldData.toString()
          break
        case 'Number':
          // 强制转换为Number, 但如果不是标准的Number, 则忽略掉值
          ; (instance as IJson)[field] = Number.isNaN(Number.parseFloat(fieldData)) ? undefined : Number.parseFloat(fieldData)
          break
        case 'Boolean':
          // 强制转换为布尔型
          ; (instance as IJson)[field] = !!fieldData
          break
        default:
          // 是对象 需要递归转换
          ; (instance as IJson)[field] = this.parse(fieldData, FieldTypeClass)
      }
    }

    // 最后删除无用的数据
    for (const fieldKey of fieldList) {
      const alias = getAlias(Class, fieldKey) || fieldKey
      if (alias === fieldKey) {
        continue
      }
      delete (instance as IJson)[alias]
    }
    return instance
  }

  /**
   * ### 获取 JSON 的 key
   * @param Class 目标实例
   * @param field 属性 key
   */
  private static getJsonKey<
    T extends Transformer,
  >(Class: ITransformerConstructor<T>,
    field: string,
  ): string {
    const alias = getAlias(Class, field)
    if (alias) {
      // 优先使用别名
      return alias
    }
    const prefix = getPrefix(Class)
    if (!prefix) {
      // 没有全局前缀
      return field
    }
    const ignorePrefix = getIgnorePrefix(Class, field)
    if (!ignorePrefix) {
      // 没有忽略前缀 则自动拼接前缀
      return prefix + field
    }
    // 默认兜底
    return field
  }

  /**
   * ### 将当前实例复制到一个新实例上
   */
  copy(): this {
    const instance = Object.create(Object.getPrototypeOf(this))
    return Object.assign(instance, this)
  }

  /**
   * ### 暴露部分类的属性
   * @param fields 属性列表
   */
  expose(...fields: Array<(keyof this) | string>): this {
    const copy = this.copy() as IJson
    const fieldList = Object.keys(copy)
    for (const field of fieldList) {
      if (!fields.includes(field)) {
        copy[field] = undefined
      }
    }
    return copy as this
  }

  /**
   * ### 排除部分类的属性
   * @param fields 属性列表
   */
  exclude(...fields: Array<(keyof this) | string>): this {
    const copy = this.copy() as IJson
    const fieldList = Object.keys(copy)
    for (const field of fieldList) {
      if (fields.includes(field)) {
        copy[field] = undefined
      }
    }
    return copy as this
  }

  /**
   * ### 用指定的数据对当前实例进行覆盖
   * 相同属性才会覆盖上去
   * @param obj 覆盖对象
   */
  recoverBy(obj: IJson | Transformer): this {
    return Object.assign(this, obj)
  }

  /**
   * ### 转换到 `JSON`
   * 会自动进行数据别名转换
   */
  toJson(): IJson {
    const Class = this.constructor as ITransformerConstructor<this>
    // 读取类的所有属性
    const fieldList = Object.keys(this)
    const json: IJson = {}
    for (const field of fieldList) {
      const data = (this as IJson)[field]
      if (data === null || data === undefined) {
        // 如果属性值为 null 或 undefined 则不转换到JSON
        continue
      }
      const jsonKey = Transformer.getJsonKey(Class, field)
      json[jsonKey] = data
      const toJson = getToJson(Class, field)

      if (toJson !== undefined) {
        // 如果标记了自定义转换JSON的方法
        try {
          json[jsonKey] = toJson(this)
        }
        catch (e) {
          console.warn('ToJson Function Error', e)
        }
        continue
      }
      if (typeof data === 'object') {
        // 是数组 循环转换
        if (Array.isArray(data)) {
          // 数组需要循环转换
          const jsonArray: IJson[] = []
          for (let i = 0; i < data.length; i += 1) {
            if (typeof data[i] === 'object') {
              jsonArray[i] = (data[i] as Transformer).toJson()
              continue
            }
            jsonArray[i] = data[i] as Transformer
          }
          json[jsonKey || field] = jsonArray
          continue
        }
        // 是对象 递归转换
        json[jsonKey || field] = (data as Transformer).toJson()
      }
    }

    return json
  }
}
