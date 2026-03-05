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
<a href="https://github.com/AirPowerTeam/AirPower-Transformer/blob/main/LICENSE">
<img src="https://img.shields.io/npm/l/@airpower/transformer"/>
</a>
</p>

<p align="center">
<a href="https://github.com/AirPowerTeam/AirPower-Transformer">Github</a> ·
<a href="https://gitee.com/air-power/AirPower-Transformer">Gitee</a> ·
<a href="https://www.npmjs.com/package/@airpower/transformer">NPM</a>
</p>

---

## 📖 项目介绍

**AirPower-Transformer** 是一个功能强大且轻量级的 TypeScript 数据转换库，专为简化 **JSON 对象** 与 **类实例**
之间的双向转换而设计。该库通过装饰器提供了一种声明式的方式来控制数据转换过程，使开发者能够轻松处理复杂的嵌套对象、数组以及具有特定格式要求的数据结构。

### 🎯 核心优势

| 优势        | 说明                               |
|-----------|----------------------------------|
| **零依赖**   | 不依赖任何外部库，纯 TypeScript 实现，轻量级解决方案 |
| **类型安全**  | 完全基于 TypeScript，提供完整的类型检查和智能提示   |
| **装饰器驱动** | 使用 TypeScript 装饰器来配置转换行为，代码清晰易懂  |
| **灵活配置**  | 支持前缀、别名、类型转换、自定义转换逻辑等多种配置方式      |
| **嵌套支持**  | 自动处理嵌套对象和数组的转换，支持深层嵌套结构          |
| **继承友好**  | 支持类的继承，装饰器配置可自动继承到子类             |

---

## ✨ 主要特性

- **双向转换**：支持从 JSON 对象到类实例的转换（`fromJson`），以及从类实例到 JSON 对象的转换（`toJson`）
- **装饰器驱动**：使用 TypeScript 装饰器来配置转换行为，代码清晰易懂
- **前缀支持**：可以为整个类或特定字段设置前缀，适应不同 API 的命名规范
- **字段别名**：支持字段别名映射，解决前后端字段名不一致的问题
- **类型转换**：自动将 JSON 数据转换为指定的类实例，支持 String、Number、Boolean 等基础类型
- **嵌套对象处理**：自动处理嵌套对象和数组的转换
- **自定义转换逻辑**：支持自定义转换函数（`@ToClass` / `@ToJson`），满足特殊转换需求
- **实例方法丰富**：提供 `copy()`、`expose()`、`exclude()`、`recoverBy()` 等实用方法

---

## 💻 安装

```bash
# npm
npm install @airpower/transformer

# yarn
yarn add @airpower/transformer

# pnpm
pnpm add @airpower/transformer
```

### 环境要求

- TypeScript >= 4.0
- 需要在 `tsconfig.json` 中启用以下配置：

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

---

## 📖 快速开始

### 基础用法

```typescript
import { Transformer } from '@airpower/transformer'

class User extends Transformer {
  id!: number
  name!: string
  email!: string
}

// 从 JSON 创建实例
const userData = { id: 1, name: 'John', email: 'john@example.com' }
const user = User.fromJson(userData)

console.log(user.id) // 输出: 1
console.log(user.name) // 输出: 'John'

// 将实例转换为 JSON
const json = user.toJson()
console.log(json) // 输出: { id: 1, name: 'John', email: 'john@example.com' }
```

### 完整示例

```typescript
import { Alias, IgnorePrefix, Prefix, Transformer, Type } from '@airpower/transformer'

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

---

## 🛠️ 装饰器详解

### 1. `@Prefix(prefix: string)`

为类的所有字段设置统一前缀，适用于 API 返回数据带有统一前缀的场景。

```typescript
import { Prefix, Transformer } from '@airpower/transformer'

@Prefix('user_')
class User extends Transformer {
  id!: number // JSON 中对应 'user_id'
  name!: string // JSON 中对应 'user_name'
  email!: string // JSON 中对应 'user_email'
}

const user = User.fromJson({
  user_id: 1,
  user_name: 'John',
  user_email: 'john@example.com'
})

console.log(user.id) // 输出: 1
console.log(user.name) // 输出: 'John'
```

### 2. `@Alias(alias: string)`

为字段设置别名，解决前后端字段命名规范不一致的问题。

```typescript
import { Alias, Transformer } from '@airpower/transformer'

class User extends Transformer {
  id!: number

  @Alias('full_name')
  name!: string // JSON 中对应 'full_name'

  @Alias('user_email')
  email!: string // JSON 中对应 'user_email'
}

const user = User.fromJson({
  id: 1,
  full_name: 'John Doe',
  user_email: 'john@example.com'
})

console.log(user.name) // 输出: 'John Doe'
console.log(user.email) // 输出: 'john@example.com'
```

### 3. `@IgnorePrefix()`

让特定字段忽略类级别的前缀设置，适用于混合命名规范的场景。

```typescript
import { IgnorePrefix, Prefix, Transformer } from '@airpower/transformer'

@Prefix('api_')
class User extends Transformer {
  id!: number // JSON 中对应 'api_id'

  @IgnorePrefix()
  temporaryId!: string // JSON 中对应 'temporaryId'，不带前缀
}

const user = User.fromJson({
  api_id: 1,
  temporaryId: 'temp123'
})

console.log(user.id) // 输出: 1
console.log(user.temporaryId) // 输出: 'temp123'
```

### 4. `@Type(constructor: Class, isArray: boolean)`

指定字段的类型，支持嵌套对象和数组的自动转换。

```typescript
import { Transformer, Type } from '@airpower/transformer'

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
  address: {
    street: '123 Main St',
    city: 'New York',
    zipCode: '10001'
  },
  addresses: [
    { street: '456 Oak Ave', city: 'Boston', zipCode: '02101' },
    { street: '789 Pine Rd', city: 'Chicago', zipCode: '60601' }
  ]
}

const user = User.fromJson(userData)
console.log(user.address.city) // 输出: 'New York'
console.log(user.addresses.length) // 输出: 2
console.log(user.addresses[0].city) // 输出: 'Boston'
```

### 5. `@ToClass(func: (json) => any)`

自定义从 JSON 到类实例的转换逻辑，适用于需要特殊处理的字段。

```typescript
import { ToClass, Transformer } from '@airpower/transformer'

class User extends Transformer {
  id!: number
  name!: string

  @ToClass(json => new Date(json.birthday_timestamp * 1000))
  birthday!: Date
}

const userData = {
  id: 1,
  name: 'John',
  birthday_timestamp: 1609459200 // 2021-01-01 的时间戳
}

const user = User.fromJson(userData)
console.log(user.birthday) // 输出: Date 对象 (2021-01-01)
```

### 6. `@ToJson(func: (instance) => any)`

自定义从类实例到 JSON 的转换逻辑，适用于需要特殊格式输出的字段。

```typescript
import { ToJson, Transformer } from '@airpower/transformer'

class User extends Transformer {
  id!: number
  name!: string
  birthday!: Date

  @ToJson(instance => Math.floor(instance.birthday.getTime() / 1000))
  birthdayTimestamp!: number
}

const user = new User()
user.id = 1
user.name = 'John'
user.birthday = new Date('2021-01-01')

const json = user.toJson()
console.log(json.birthdayTimestamp) // 输出: 1609459200
```

---

## 📦 API 参考

### Transformer 类方法

| 方法                          | 参数                                   | 返回值     | 描述                          |
|-----------------------------|--------------------------------------|---------|-----------------------------|
| `fromJson(json)`            | `json: IJson`                        | `T`     | 从 JSON 对象创建类实例，自动进行数据别名转换   |
| `fromJsonArray(jsonArray)`  | `jsonArray: IJson \| IJson[]`        | `T[]`   | 从 JSON 数组创建类实例数组            |
| `newInstance(Class, json?)` | `Class: Constructor`, `json?: IJson` | `T`     | 创建类的新实例，可选择性地用 JSON 数据初始化   |
| `copy()`                    | -                                    | `this`  | 复制当前实例到新实例                  |
| `expose(...fields)`         | `fields: string[]`                   | `void`  | 只保留指定的字段，其他字段设为 `undefined` |
| `exclude(...fields)`        | `fields: string[]`                   | `void`  | 排除指定的字段，将指定字段设为 `undefined` |
| `recoverBy(json)`           | `json: IJson \| Transformer`         | `void`  | 用指定的 JSON 数据恢复/覆盖当前实例状态     |
| `toJson()`                  | -                                    | `IJson` | 将实例转换为 JSON 对象，自动进行数据别名转换   |

### 装饰器

| 装饰器                      | 参数                                        | 作用目标 | 描述                |
|--------------------------|-------------------------------------------|------|-------------------|
| `@Prefix(prefix)`        | `prefix: string`                          | 类    | 为类的所有字段设置统一前缀     |
| `@Alias(alias)`          | `alias: string`                           | 字段   | 为字段设置别名           |
| `@IgnorePrefix()`        | -                                         | 字段   | 让字段忽略类级别的前缀       |
| `@Type(Class, isArray?)` | `Class: Constructor`, `isArray?: boolean` | 字段   | 指定字段的类型，支持嵌套对象和数组 |
| `@ToClass(func)`         | `func: (json) => any`                     | 字段   | 自定义从 JSON 到类的转换逻辑 |
| `@ToJson(func)`          | `func: (instance) => any`                 | 字段   | 自定义从类到 JSON 的转换逻辑 |

---

## 🚀 常见使用场景

### 1. API 数据适配

当后端 API 返回的数据格式与前端模型不匹配时，使用装饰器可以轻松完成数据转换。

```typescript
@Prefix('data_')
class ApiResponse extends Transformer {
  @Type(User)
  userInfo!: User

  @Alias('status_code')
  statusCode!: number
}
```

### 2. 数据验证和清洗

在数据进入应用之前，通过转换过程进行初步的验证和清洗。

```typescript
class User extends Transformer {
  @ToClass(json => json.email?.toLowerCase().trim())
  email!: string

  @ToClass(json => json.phone?.replace(/\D/g, ''))
  phone!: string
}
```

### 3. 不同系统间的数据交换

在微服务架构中，不同服务可能使用不同的数据格式，此库可以帮助统一数据格式。

```typescript
@Prefix('legacy_')
class LegacySystemData extends Transformer {
  @Alias('USER_ID')
  userId!: number

  @Alias('USER_NAME')
  userName!: string
}
```

### 4. 前后端数据格式差异

解决前端和后端开发团队使用不同命名约定的问题。

```typescript
// 后端使用 snake_case，前端使用 camelCase
@Prefix('user_')
class User extends Transformer {
  @Alias('created_at')
  createdAt!: Date

  @Alias('updated_at')
  updatedAt!: Date
}
```

### 5. 日期时间处理

处理不同系统间的日期时间格式转换。

```typescript
class Event extends Transformer {
  @ToClass(json => new Date(json.event_date))
  eventDate!: Date

  @ToJson(instance => instance.eventDate.toISOString())
  eventDateIso!: string
}
```

---

## 🔧 开发指南

### 项目结构

```
src/
├── decorator/           # 装饰器实现
│   ├── Alias.ts         # 字段别名装饰器
│   ├── IgnorePrefix.ts  # 忽略前缀装饰器
│   ├── Prefix.ts        # 类前缀装饰器
│   ├── ToClass.ts       # 自定义类转换装饰器
│   ├── ToJson.ts        # 自定义 JSON 转换装饰器
│   └── Type.ts          # 类型转换装饰器
├── transformer/         # 核心转换器实现
│   ├── IJson.ts         # JSON 接口定义
│   ├── ITransformerConstructor.ts  # 构造函数接口
│   └── Transformer.ts   # 主转换器类
├── type/                # 类型定义
│   └── index.ts         # 类型导出
├── util/                # 工具类
│   └── DecoratorUtil.ts # 装饰器工具类
└── index.ts             # 主入口文件
```

### 构建命令

```bash
# 安装依赖
npm install

# 运行 ESLint 检查、TypeScript 编译和 Vite 打包
npm run build
```

### 版本发布自动化流程

- 使用 `eslint --fix` 修复项目中可能出现的问题
- 更新 `package.json` 中的版本号
- 使用 `yarn build` 构建项目
- 使用 `npm publish` 发布包
- 使用 `git add/commit/push` 将本地所有变更的文件推送到 Github
- 根据当前版本创建 `git tag` 并推送到Github，格式例如 `v1.2.3`

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进这个项目！

### 贡献步骤

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

---

## ⏰ 支持与反馈

- 📝 **问题反馈**：通过本仓库的 [Issues](https://github.com/AirPowerTeam/AirPower-Transformer/issues) 与我们联系
- 💡 **需求建议**：欢迎通过本仓库的 [Issues](https://github.com/AirPowerTeam/AirPower-Transformer/issues) 提出
- 💬 **技术交流**：加入 QQ 群 **555156313** 与我们及时反馈

---

## 📄 许可证

MIT License

---

## 👥 团队信息

- **作者**：Hamm
- **邮箱**：admin@hamm.cn
- **Github**：[HammCn](https://github.com/HammCn)
- **团队**：[AirPowerTeam](https://github.com/AirPowerTeam)

---

<p align="center">
  <a href="https://github.com/AirPowerTeam/AirPower-Transformer">Github</a> ·
  <a href="https://gitee.com/air-power/AirPower-Transformer">Gitee</a> ·
  <a href="https://www.npmjs.com/package/@airpower/transformer">NPM</a>
</p>
