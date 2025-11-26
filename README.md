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

# 🎉 项目介绍

**AirPower-Transformer** 是一个基于 `TypeScript` 的数据转换器，提供了从 `JSON` 对象到 `类实例` 对象之间互相转换的系列装饰器和方法。

# 💻 如何安装

```shell
npm install @airpower/transformer
# or
yarn add @airpower/transformer
# or
cnpm install @airpower/transformer
# or ...
```

# 📖 使用说明

```ts
import {IgnorePrefix, Prefix, Transformer, Type} from '@airpower/transformer'

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

  @Type(Role, true)
  roleList: Role[] = []
}

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
console.warn('json', JSON.stringify(json))

json.name = '???' // 无效
const user2 = User.fromJson(json)
console.warn('user2', user2)
```

# ⏰ 欢迎反馈

如有疑问，可以通过本仓库的 **Issues** 与我们联系，如果你有一些代码贡献，可以通过 **Pull Request** 将代码贡献，为这个项目添砖加瓦。

如果有更多的需求和建议，欢迎通过本仓库的 `Issues` 提出，也欢迎加入 QQ群 555156313 与我们及时反馈。
