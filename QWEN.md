# AirPower-Transformer

AirPower-Transformer 是一个基于 TypeScript 的数据转换器，提供了从 JSON 对象到类实例对象之间互相转换的系列装饰器和方法。该项目主要用于简化复杂对象结构的序列化和反序列化过程。

## 项目概述

这是一个轻量级的 TypeScript 库，专注于在 JSON 数据和类实例之间进行双向转换。它使用装饰器模式来提供灵活的数据映射功能，支持嵌套对象、数组、类型转换等特性。

### 主要特性

- **装饰器驱动**: 使用 TypeScript 装饰器来配置数据转换规则
- **前缀支持**: 支持为整个类或特定字段设置前缀
- **类型转换**: 自动将 JSON 数据转换为指定的类实例
- **别名映射**: 支持字段别名，便于处理不同命名规范的数据
- **数组支持**: 支持嵌套对象数组的转换
- **自定义转换**: 提供自定义转换函数的能力

### 核心概念

- `Transformer`: 基础转换类，提供 JSON 与类实例之间的转换方法
- `@Prefix`: 为类的所有字段设置统一前缀
- `@Type`: 指定字段应转换为特定类型
- `@Alias`: 为字段设置别名
- `@IgnorePrefix`: 忽略特定字段的前缀设置
- `@ToClass` / `@ToJson`: 自定义转换逻辑

## 项目结构

```
src/
├── decorator/           # 装饰器实现
│   ├── Alias.ts         # 字段别名装饰器
│   ├── IgnorePrefix.ts  # 忽略前缀装饰器
│   ├── Prefix.ts        # 类前缀装饰器
│   ├── ToClass.ts       # 自定义类转换装饰器
│   ├── ToJson.ts        # 自定义JSON转换装饰器
│   └── Type.ts          # 类型转换装饰器
├── transformer/         # 核心转换器实现
│   ├── IJson.ts         # JSON 接口定义
│   ├── ITransformerConstructor.ts # 构造函数接口
│   ├── Transformer.ts   # 主转换器类
│   └── index.ts         # 导出文件
├── type/                # 类型定义
│   └── index.ts         # 类型导出
├── util/                # 工具类
│   ├── DecoratorUtil.ts # 装饰器工具类
│   └── index.ts         # 导出文件
└── index.ts             # 主入口文件
```

## 使用方式

### 安装

```bash
npm install @airpower/transformer
```

### 基本用法

```ts
import { IgnorePrefix, Prefix, Transformer, Type } from '@airpower/transformer'

@Prefix('role____')
class Role extends Transformer {
  id!: number
  name!: string
}

@Prefix('user_')
class User extends Transformer {
  id!: number
  name!: string

  @IgnorePrefix()
  age!: number

  @Type(Role)
  role!: Role

  @Type(Role, true) // 第二个参数表示数组
  roleList: Role[] = []
}

// 创建实例并转换为 JSON
const user = new User()
user.id = 1
user.name = 'Hamm'
user.age = 18

const role = new Role()
role.name = 'Admin'
user.role = role

const roleItem = new Role()
roleItem.name = 'User'
user.roleList.push(roleItem)

const json = user.copy().toJson()
console.log('json', JSON.stringify(json))

// 从 JSON 转换回实例
const user2 = User.fromJson(json)
console.log('user2', user2)
```

## 开发约定

### 编码风格

- 使用 TypeScript 编写
- 遵循 ESLint 配置（@antfu/eslint-config）
- 使用装饰器语法进行元数据配置
- 严格类型检查

### 测试实践

- 项目目前没有明确的测试文件，但应该添加单元测试来验证转换功能
- 建议为每个装饰器和核心功能编写测试用例

### 贡献指南

- 提交代码前运行 `npm run build` 确保构建成功
- 遵循项目的编码风格和约定
- 添加适当的注释和文档

## 构建和发布

### 构建命令

```bash
npm run build  # 运行 ESLint 检查、TypeScript 编译和 Vite 打包
```

### 发布流程

- 项目使用 npm 发布，版本号遵循语义化版本控制
- 发布到公共 npm 仓库 (`@airpower/transformer`)

### 构建配置

- 使用 Vite 进行打包
- 输出格式：ES 模块
- 同时生成类型声明文件

## 技术栈

- **TypeScript**: 主要编程语言，提供静态类型检查
- **Vite**: 构建工具，用于打包和开发服务器
- **ESLint**: 代码质量检查工具
- **Reflection**: 使用反射机制存储和读取装饰器元数据
- **Decorators**: 使用 TypeScript 装饰器语法提供配置能力

## 核心实现原理

1. **装饰器元数据存储**: 使用 `Reflect` API 存储装饰器配置信息
2. **递归转换**: 支持嵌套对象和数组的深度转换
3. **类型推断**: 通过装饰器配置实现类型安全的转换
4. **前缀处理**: 在 JSON 键和类属性之间进行智能映射

## 注意事项

- 需要在 tsconfig.json 中启用 `experimentalDecorators` 和 `emitDecoratorMetadata`
- 转换过程中会自动处理 null/undefined 值
- 支持继承关系中的装饰器配置继承

## 版本发布自动化流程

- 使用 `eslint --fix` 修复项目中可能出现的问题
- 更新 `package.json` 中的版本号
- 使用 `yarn build` 构建项目
- 使用 `npm publish` 发布包
- 使用 `git add/commit/push` 将本地的变更推送到 Github
- 创建 `git tag` 并推送到Github
