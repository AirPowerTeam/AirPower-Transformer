<p align="center">
  <img width="300" src="./assets/airpower-bg.svg"/>
</p>

<p align="center">
<a href="https://www.npmjs.com/@airpower/transformer">
<img src="https://img.shields.io/npm/v/@airpower/transformer"/>
</a>
<a href="https://www.npmjs.com/@airpower/transformer">
<img src="https://img.shields.io/npm/dm/@airpower/transformer"/>
</a>
</p>

<p align="center">
<a href="https://github.com/AirPowerTeam/AirPower-Transformer">Github</a> /
<a href="https://gitee.com/air-power/AirPower-Transformer">Gitee</a> /
<a href="https://www.npmjs.com/package/@airpower/transformer">NPM</a>
</p>

# 🎉 AirPower-Transformer 项目介绍

**AirPower-Transformer** 是一个功能强大且易于使用的 TypeScript 数据转换库，专为简化 JSON
对象与类实例之间的双向转换而设计。该库通过装饰器提供了一种声明式的方式来控制数据转换过程，使开发者能够轻松处理复杂的嵌套对象、数组以及具有特定格式要求的数据结构。

## ✨ 主要特性

- **双向转换**：支持从 JSON 对象到类实例的转换，以及从类实例到 JSON 对象的转换
- **装饰器驱动**：使用 TypeScript 装饰器来配置转换行为，代码清晰易懂
- **前缀支持**：可以为整个类或特定字段设置前缀，适应不同 API 的命名规范
- **字段别名**：支持字段别名映射，解决前后端字段名不一致的问题
- **类型安全**：完全基于 TypeScript，提供完整的类型检查和智能提示
- **嵌套对象处理**：自动处理嵌套对象和数组的转换
- **自定义转换逻辑**：支持自定义转换函数，满足特殊转换需求
- **零依赖**：不依赖任何外部库，轻量级解决方案

## 💻 安装

```shell
npm install @airpower/transformer
# or
yarn add @airpower/transformer
# or
pnpm add @airpower/transformer
```

## 📖 使用指南

### 基础用法

```typescript
import {Transformer} from '@airpower/transformer'

class User extends Transformer {
  id!: number
  name!: string
  email!: string
}

// 从 JSON 创建实例
const userData = {id: 1, name: 'John', email: 'john@example.com'}
const user = User.fromJson(userData)

// 将实例转换为 JSON
const json = user.toJson()
```

### 装饰器详解

#### 1. `@Prefix(prefix: string)`

为类的所有字段设置统一前缀：

```typescript
import {Prefix, Transformer} from '@airpower/transformer'

@Prefix('user_')
class User extends Transformer {
  id!: number // JSON 中对应 'user_id'
  name!: string // JSON 中对应 'user_name'
  email!: string // JSON 中对应 'user_email'
}

const user = User.fromJson({user_id: 1, user_name: 'John', user_email: 'john@example.com'})
console.log(user.id) // 输出: 1
console.log(user.name) // 输出: 'John'
```

#### 2. `@Alias(alias: string)`

为字段设置别名：

```typescript
import {Alias, Transformer} from '@airpower/transformer'

class User extends Transformer {
  id!: number

  @Alias('full_name')
  name!: string // JSON 中对应 'full_name'

  @Alias('user_email')
  email!: string // JSON 中对应 'user_email'
}

const user = User.fromJson({id: 1, full_name: 'John Doe', user_email: 'john@example.com'})
console.log(user.name) // 输出: 'John Doe'
console.log(user.email) // 输出: 'john@example.com'
```

#### 3. `@IgnorePrefix()`

让特定字段忽略类级别的前缀：

```typescript
import {IgnorePrefix, Prefix, Transformer} from '@airpower/transformer'

@Prefix('api_')
class User extends Transformer {
  id!: number // JSON 中对应 'api_id'

  @IgnorePrefix()
  temporaryId!: string // JSON 中对应 'temporaryId'，不带前缀
}

const user = User.fromJson({api_id: 1, temporaryId: 'temp123'})
console.log(user.id) // 输出: 1
console.log(user.temporaryId) // 输出: 'temp123'
```

#### 4. `@Type(constructor: Class, isArray: boolean)`

指定字段的类型，支持嵌套对象和数组：

```typescript
import {Transformer, Type} from '@airpower/transformer'

class Address extends Transformer {
  street!: string
  city!: string
  zipCode!: string
}

class User extends Transformer {
  id!: number
  name!: string

  @Type(Address)
  address!: Address // 嵌套对象

  @Type(Address, true)
  addresses: Address[] = [] // 对象数组
}

const userData = {
  id: 1,
  name: 'John',
  address: {street: '123 Main St', city: 'New York', zipCode: '10001'},
  addresses: [
    {street: '456 Oak Ave', city: 'Boston', zipCode: '02101'},
    {street: '789 Pine Rd', city: 'Chicago', zipCode: '60601'}
  ]
}

const user = User.fromJson(userData)
console.log(user.address.city) // 输出: 'New York'
console.log(user.addresses.length) // 输出: 2
console.log(user.addresses[0].city) // 输出: 'Boston'
```

#### 5. `@ToClass(func: (json) => any)` 和 `@ToJson(func: (instance) => any)`

自定义转换逻辑：

```typescript
import {ToClass, ToJson, Transformer} from '@airpower/transformer'

class User extends Transformer {
  id!: number
  name!: string

  @ToClass(json => new Date(json.birthday_timestamp * 1000))
  birthday!: Date

  @ToJson(instance => Math.floor(instance.birthday.getTime() / 1000))
  birthdayTimestamp!: number
}

const userData = {
  id: 1,
  name: 'John',
  birthday_timestamp: 1609459200 // 2021-01-01
}

const user = User.fromJson(userData)
console.log(user.birthday) // 输出: Date 对象 (2021-01-01)
```

### 完整示例

```typescript
import {Alias, IgnorePrefix, Prefix, Transformer, Type} from '@airpower/transformer'

// 定义嵌套类
@Prefix('addr_')
class Address extends Transformer {
  id!: number
  @Alias('street_address')
  street!: string

  city!: string
  country!: string
}

@Prefix('role_')
class Role extends Transformer {
  id!: number
  name!: string
  @IgnorePrefix()
  permissions: string[] = []
}

// 主类
@Prefix('usr_')
class User extends Transformer {
  id!: number
  @Alias('full_name')
  name!: string

  email!: string

  @IgnorePrefix()
  temporaryToken!: string

  @Type(Address)
  homeAddress!: Address

  @Type(Role, true)
  roles: Role[] = []

  createdAt!: Date
}

// 使用示例
const jsonData = {
  usr_id: 1,
  full_name: 'John Doe',
  usr_email: 'john@example.com',
  temporaryToken: 'abc123',
  homeAddress: {
    addr_id: 1,
    street_address: '123 Main St',
    addr_city: 'New York',
    addr_country: 'USA'
  },
  roles: [
    {
      role_id: 1,
      role_name: 'Admin',
      permissions: ['read', 'write', 'delete']
    },
    {
      role_id: 2,
      role_name: 'User',
      permissions: ['read']
    }
  ],
  usr_createdAt: '2023-01-01T00:00:00Z'
}

// 从 JSON 创建实例
const user = User.fromJson(jsonData)
console.log(user.name) // 'John Doe'
console.log(user.temporaryToken) // 'abc123'
console.log(user.homeAddress.street) // '123 Main St'
console.log(user.roles.length) // 2
console.log(user.roles[0].permissions) // ['read', 'write', 'delete']

// 转换回 JSON
const jsonOutput = user.toJson()
console.log(JSON.stringify(jsonOutput, null, 2))
```

## 🚀 常见使用场景

### 1. API 数据适配

当后端 API 返回的数据格式与前端模型不匹配时，使用装饰器可以轻松完成数据转换。

### 2. 数据验证和清洗

在数据进入应用之前，通过转换过程进行初步的验证和清洗。

### 3. 不同系统间的数据交换

在微服务架构中，不同服务可能使用不同的数据格式，此库可以帮助统一数据格式。

### 4. 前后端数据格式差异

解决前端和后端开发团队使用不同命名约定的问题。

## 🛠️ API 参考

### Transformer 类方法

| 方法                          | 描述                        |
|-----------------------------|---------------------------|
| `fromJson(json)`            | 从 JSON 对象创建类实例            |
| `fromJsonArray(jsonArray)`  | 从 JSON 数组创建类实例数组          |
| `newInstance(Class, json?)` | 创建类的新实例，可选择性地用 JSON 数据初始化 |
| `copy()`                    | 复制当前实例                    |
| `expose(...fields)`         | 只保留指定的字段                  |
| `exclude(...fields)`        | 排除指定的字段                   |
| `recoverBy(json)`           | 用 JSON 数据恢复实例状态           |
| `toJson()`                  | 将实例转换为 JSON               |

### 装饰器

| 装饰器                                           | 参数          | 描述                |
|-----------------------------------------------|-------------|-------------------|
| `@Prefix(prefix: string)`                     | 前缀字符串       | 为类的所有字段设置统一前缀     |
| `@Alias(alias: string)`                       | 别名字符串       | 为字段设置别名           |
| `@IgnorePrefix()`                             | 无           | 让字段忽略类级别的前缀       |
| `@Type(constructor: Class, isArray: boolean)` | 类构造函数和是否为数组 | 指定字段的类型           |
| `@ToClass(func: (json) => any)`               | 自定义转换函数     | 自定义从 JSON 到类的转换逻辑 |
| `@ToJson(func: (instance) => any)`            | 自定义转换函数     | 自定义从类到 JSON 的转换逻辑 |

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进这个项目！

## ⏰ 支持与反馈

如有疑问，可以通过本仓库的 **Issues** 与我们联系，如果你有一些代码贡献，可以通过 **Pull Request** 将代码贡献，为这个项目添砖加瓦。

如果有更多的需求和建议，欢迎通过本仓库的 `Issues` 提出，也欢迎加入 QQ群 555156313 与我们及时反馈。

## 📄 许可证

MIT License

---

<p align="center">
  <a href="https://github.com/AirPowerTeam/AirPower-Transformer">Github</a> /
  <a href="https://gitee.com/air-power/AirPower-Transformer">Gitee</a> /
  <a href="https://www.npmjs.com/package/@airpower/transformer">NPM</a>
</p>
