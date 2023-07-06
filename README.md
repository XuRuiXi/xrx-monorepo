### 使用pnpm搭建monorepo项目


**目标**
- 多个项目共享依赖。
- 组件库支持打包成cjs、umd格式，供不同的项目使用
- 给组件库项目添加单元测试


**单一代码库的好处**
- 代码复用更加方便
- 唯一依赖源：所有项目都使用同一个依赖源，可以减少依赖的冲突
- 更统一的开发规范：所有项目都使用同一个开发规范，可以减少开发规范的冲突
- 统一项目迭代的时间线。



---
### 架构篇
---


**<font color="red">pnpm-workspace.yaml</font>**

在项目根目录下创建pnpm-workspace.yaml文件，配置monorepo项目的packages路径，下面的意思是，项目根目录下的libs、packages、uis目录都是monorepo项目的packages路径，pnpm会自动识别这些路径下的package.json文件，然后安装依赖。

```yaml
packages: 
    - "libs/**"
    - "packages/**"
    - "uis/**"
```


**在根目录执行 <font color="red">pnpm install</font>**

执行pnpm install，会自动安装所有packages路径下的依赖，安装完成后，会在项目根目录下生成一个pnpm-lock.yaml文件，这个文件记录了所有依赖的版本号，类似于yarn.lock文件。

**在根目录执行 <font color="red">pnpm --filter web start</font>**

- 执行pnpm --filter web start，会自动执行web项目的 start 命令，这个 start 命令是在web项目的package.json文件中定义的。

- 其中，--filter web 表示只执行web项目的 start 命令。

- 也可以单独在子项目的根目录下执行pnpm start，效果是一样的。

所以，我们会在根目录的package.json文件中，定义一些命令，用来执行子项目的命令，比如：

```json
{
    "scripts": {
        "start": "pnpm --filter web start",
        "build": "pnpm --filter web build",
    }
}
```

---

#### 把@self/util项目的依赖，安装到web项目中，执行命令如下：

```shell
pnpm add @self/util --filter web
```

上面的命令，会把@self/util项目的依赖，安装到web项目中，然后在web项目的package.json文件中，会自动添加@self/util项目的依赖。
```json
{
    "dependencies": {
        "@self/util": "workspace:^1.0.0",
    },
}
```


其中@self/util是子项目的名称，可以在子项目的package.json文件中，通过name字段指定。
```json
{
    "name": "@self/util",
}
```

#### 在根目录共享依赖给所有子项目

- 首先在根目录的package.json文件中，添加workspaces字段，指定monorepo项目的packages路径。
```json
{
      "workspaces": {
        "packages": [
          "libs/**",
          "packages/**",
          "uis/**"
        ]
  },
}
```
- 然后在根目录添加依赖
```shell
pnpm add -D lodash@4 -w
```

这样所有的子项目都会自动添加lodash依赖，而且版本号都是一样的。

---
### 打包篇
---

**<font color="red">介绍前端模块的常用的几种格式</font>**
- esm：es module，es6的模块化规范，使用import导入，export导出。
    - 因为esm导入导出是静态的，所以可以支持Tree Shaking

- cjs：commonjs，nodejs的模块化规范，使用require导入，module.exports导出。
- amd：异步模块定义，浏览器端的模块化规范，使用require导入，define导出（定义）。

- umd：通用模块定义，兼容cjs和amd的模块化规范。
    - 严格来说umd不是一种模块化规范，而是一种打包规范，它会根据不同的环境，使用不同的模块化规范。所以umd会判断当前环境支持哪种模块化规范，然后使用对应的模块化规范。


**<font color="red">打包成cjs格式</font>**

在xrx-components项目的入口文件中，有以下代码。
```js
import _Table from './components/Table';

export const Table = _Table;

export default {
  Table,
};
```

我们的打包配置如下：
```js
output: {
    filename: 'index.cjs.js',
    libraryTarget: 'commonjs2',
    library: 'myLib',   //库的名字
}
````

那么，打包后的结果如下：
```js
{
    myLib: {
        Table: [Function: _Table],
        default: {
            Table: [Function: Table]
        }
    }
}
```

webpack会把入口文件中的所有导出值，都放到myLib对象中，然后把myLib对象作为库的导出值。

如果此时我们加上**libraryExport属性**
```js
output: {
    filename: 'index.cjs.js',
    libraryTarget: 'commonjs2',
    library: 'myLib',   //库的名字
    libraryExport: 'default'
}
```

那么，打包后的结果如下：
```js
{
    myLib: {
        Table: [Function: Table]
    }
}
```

这是因为libraryExport会把default属性的值，赋值给库的导出值（myLib）。

但是通常情况下，我们的cjs格式的库是不应该有名称的，所以我们可以把**library**去掉，也不应该限制导出值的名称，所以我们可以把**libraryExport**去掉，这样打包后的结果如下：

```js
{
    Table: [Function: _Table],
    default: {
        Table: [Function: Table]
    }
}
```

**所以最终cjs的打包配置如下**
```js
output: {
    filename: 'index.cjs.js',
    libraryTarget: 'commonjs2',
}
```

**拓展**  
libraryTarget: commonjs2和commonjs的区别
- commonjs2：导出的是module.exports
- commonjs：导出的是exports

它们在使用上没有区别，只是commonjs只定义了exports，而commonjs2定义了module.exports。但是commonjs2的兼容性更好，因为在node环境下，exports是module.exports的别名，所以commonjs2的兼容性更好。



**剔除多余的代码包：externals**  
分析：我们的Table组件，使用到了react和antd，但是我们的库并不需要把react和antd打包进去，所以我们可以通过externals属性，把react和antd剔除掉。被剔除的包，在源码内部会通过require的方式引用。

```js
externals: {
    react: {
        commonjs2: 'react',
    },
    antd: {
        commonjs2: 'antd',
    },
}
```

- react是必须要移除的，如果我们把组件库引用的react打包进去，那么我们的组件库和使用者的react会重复，会导致react的不一致，从而导致一些问题。
- antd是可选的，如果我们的组件库引用了antd，那么我们的组件库和使用者的antd会重复，所以这里需要移除。

**注意**
这里移除之后，我们需要在组件的package.json文件中，声明使用到该组件的，需要在peerDependencies加上依赖，比如：
```json
{
    "peerDependencies": {
        "react": "^17.0.2",
        "antd": "^4.16.13"
    }
}
```




**<font color="red">打包成umd格式</font>**

我们的打包配置如下：
```js
output: {
    filename: 'index.umd.js',
    libraryTarget: 'umd',
    library: 'myLib',   //库的名字
    libraryExport: 'default'
}
```

那么，打包后的结果如下：
```js
{
    myLib: {
            Table: [Function: Table]
        }
}
```

如果此时我们去掉**libraryExport属性**
```js
output: {
    filename: 'index.umd.js',
    libraryTarget: 'umd',
    library: 'myLib',   //库的名字
}
```

那么，打包后的结果如下：
```js
{
    myLib: {
        _Table: [Function: _Table],
        default: {
            Table: [Function: Table]
        }
    }
}
```


---
### 在xrx-components项目加入单元测试（React Testing Library + Jest）
---

**为什么要加入单元测试**  
首先明确一点给项目加入单元测试，会很明显的增加项目的开发成本。所以不是所有项目都需要加入单元测试。
而我们的组件库，是一个公共组件库，会被很多项目使用，所以我们需要保证组件库的质量，所以我们需要加入单元测试。


**react-test-renderer快照**
- 更新快照：pnpm jest -u


**test.only**
- test.only只会执行这一个测试用例，同一个test文件下的其他测试用例都会被skipped跳过。
```js
const obj = {};
test('obj1', () => {
  Object.assign(obj, { a: 1 });
  expect(obj).toEqual({ a: 1 });
});
test.only('obj2', () => {
  Object.assign(obj, { b: 1 });
  expect(obj).toEqual({ b: 1 });
});
```


**toBe & toEqual**
- toBe：就是全等 ===
- toEqual：并不会比较对象的引用地址，只会比较对象的值。

```js
  test('toBe & toEqual', () => {
    const a = { one: 1, two: 2 };
    expect(a).toBe(a);
    expect(a).toEqual({ two: 2, one: 1 });
  });
});
```


**触发组件事件**  

下面的例子是
- 点击Tab2，然后判断Tab2的aria-selected属性是否为true。
- 输入框输入hello，然后判断输入框的值是否为hello，判断onChange方法是否被调用。

```js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Tabs from '../components/Tabs';
import Input from '../components/Input';

describe('Event', () => {
  test('on click', () => {
    render(<Tabs />);
    fireEvent.click(screen.getByText('Tab 2'));
    const dom = screen.getByText('Tab 2');
    // 获取dom的aria-selected属性
    expect(dom.getAttribute('aria-selected')).toBe('true');
  });
    test('on change', () => {
    const onChange = jest.fn();
    render(<Input onChange={onChange} />);
    // 获取input元素
    const input = screen.getByRole('textbox');
    fireEvent.change(input, {
      target: { value: 'hello' },
    });
    // 判断input元素的值是否为hello
    expect(input.value).toBe('hello');
    // 判断onChange方法是否被调用
    expect(onChange).toHaveBeenCalled();
    // 判断调用了几次
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
```


**获取元素的几种方法**
getBy：如果找不到元素，会直接抛出异常。
queryBy：如果找不到元素，会返回null。这个对比getBy，就是可以判断元素是否存在。
findBy：如果找不到元素，会等待一段时间，如果还是找不到，会抛出异常。一般用于异步加载的元素。但是这个异步仅仅支持promise


**mock axios请求，测试组件**

AxiosCop.js
```js
import React, { useEffect } from 'react';
import axios from 'axios';

const AxiosCop = () => {
  const [name, setName] = React.useState('');
  const [age, setAge] = React.useState('');
  const getName = () => {
    axios.get('/api/name').then(res => {
      setName(res);
    });
  };
  const getAge = () => {
    axios.get('/api/age').then(res => {
      setAge(res);
    });
  };
  useEffect(() => {
    getAge();
  }, []);
  return (
    <div>
      <div>姓名：{name}</div>
      <div>年龄：{age}</div>
      <button onClick={getName}>获取姓名</button>
    </div>
  );
};

export default AxiosCop;
```
axiosCop.test.js
```js
import React from 'react';
import axios from 'axios';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AxiosCop from '../components/AxiosCop';
 
jest.mock('axios');
 
describe('App', () => {
  test('fetches name from an API and displays them', async () => {
    axios.get.mockImplementationOnce(() =>  Promise.resolve('29'));
    render(<AxiosCop />);
    const ageItems = await screen.findByText(/年龄：29/);
    expect(ageItems).toBeInTheDocument();
    axios.get.mockImplementationOnce(() =>  Promise.resolve('xrx'));
    fireEvent.click(screen.getByRole('button'));
    const nameItems = await screen.findByText(/姓名：xrx/);
    expect(nameItems).toBeInTheDocument();
  });
});
```


**mock fetch请求，测试组件**  
测试结束时需要删除全局对象中的模拟方法(fetch)  
FetchCop.js
```js
import React, { useEffect, useState } from 'react';

const FetchCop = () => {
  const [name, setName] = useState('');
  useEffect(() => {
    async function fetchData() {
      const response = await fetch('https://example.com/data.json');
      const result = await response.json();
      setName(result);
    }
    fetchData();
  }, []);

  return (
    <div>
      姓名：{name}
    </div>
  );
};
export default FetchCop;
```

fetchCop.test.js
```js
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FetchCop from '../components/FetchCop';

describe('FetchCop', () => {
  test('should render fetched data', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: async () => 'xrx'
    });
    render(<FetchCop />);
    const nameItems = await screen.findByText(/姓名：xrx/);
    expect(nameItems).toBeInTheDocument();
    delete global.fetch;
  });
});
```

**输出测试报告**

jest.config.js
```js
module.exports = {
  testEnvironment: 'jsdom',
  // 收集测试覆盖率
  collectCoverage: true,
  // 测试覆盖率报告输出目录
  coverageDirectory: 'coverage',
  // 收集components目录下的组件测试覆盖率
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}'
  ],
};
```
输出markdown语法的表格
| 指标  | 说明  |
| ------------ | ------------ |
|  stmts | 语句覆盖率  |
|  branches | 分支覆盖率  |
|  funcs | 函数覆盖率  |
|  lines | 行覆盖率  |








---
### 解决的问题篇
---


#### **<font color="red">引入外部项目的react组件，报错不支持jsx</font>**
**问题描述**：在web项目中，引入了uis的react组件，但是报错不支持jsx。

**解决办法**：在web项目中，添加自定义loader，对于来自uis的react组件，使用@babel/core，设置react预设，进行转换。

web/config/dev.config.js
```js
rules: {
  test: /\.js$/,
  use: [
    'babel-loader',
    path.resolve(__dirname, '../loaders/transfromOutsideLoader.js')
  ],
  exclude: /node_modules/, // 不处理的文件夹
},
```
./transfromOutsideLoader.js
```js
function transfromOutsideLoader(scorce, map, meta) {
  var callback = this.async();
  if (this.resourcePath.includes('xrx-components')) {
    const ast = require('@babel/core').transformSync(scorce, {
      presets: ['@babel/preset-react'],
    });
    callback(null, ast.code, map, meta);
  } else {
    callback(null, scorce, map, meta);
  }
}
module.exports = transfromOutsideLoader;
```



#### **<font color="red">针对老项目的三大改造</font>**

- 启动方式改造
    - 放弃以前用nginx启动项目的方式，改用webpack-dev-server启动项目和代理接口。
- 编写打包器
    - 针对js和css文件，同时为了不影响主进程的打包速度。开启子进程，执行babel和postcss命令，解决语法兼容问题。
    - 针对html文件，提取js和css内容，创建临时的js和css文件，同样放在子进程中执行babel和postcss命令，再进行转换后的覆盖写入。
    - 对于其他文件进行拷贝。
- 添加插件拓展和loader机制
    - 模仿webpack插件机制，增加了2个钩子，分别是beforeCompile和afterCompile。
    - 模仿webpack loader机制，调用对应的loader进行处理。

#### **为什么不采用webpack打包多页应用，而是要自己写一个打包器**  
webpack是基于模块化的打包器，是对模块的整合然后再输出。天然是为了具有SPA思想的项目而生的。
而我写的打包器是基于对原有文件的拷贝，然后再进行处理。完全是为了多页项目服务的。


#### **解决项目间react组件共享**  
写一个loader。在用到组件库的项目中，添加自定义loader，对于来自uis的组件，使用@babel/core，设置react预设，进行转换。完美解决了问题，而又不会对组件库项目产生影响。


---
### 仓库主要的功能和作用
---

- 背景：
    海口政务的项目一共有10个左右。由于时间跨度大，项目使用的技术/框架有jq、react、fish。

- 存在以下几个需要解决的问题
    - **老项目**的开发模式落后。**引入webpack**，增加2个功能
        - 使用webpack-dev-server，代替nginx启动项目和代理接口。。
        - 编写打包器，解决老项目的语法兼容问题。
    
    - **建立组件库**，解决项目之间的组件复用问题。考虑到项目之间的技术栈不一致，所以组件库需要兼容jq、react、fish。
        - react项目：使用commonjs规范打包的组件库。(不打包成esm格式，是因为webpack打包成esm的功能处于实验阶段，还不稳定)
        - 其他：使用umd打包的**远程组件库**。
        - 为了兼容远程组件库，而且不破坏原有组件的使用方式，所以导出的远程组件，都经过一层Wrapper包装。

    - **建立工具库**，项目之间还有大量的通用工具函数可以抽离共享。建立工具库，解决项目之间的工具函数复用问题。
        - 因此考虑到组件和函数在各个模块之间的复用。如果通过发布npm --> 项目引用这种开发模式。库的维护成本高，而且开发体验割裂。而且这些库仅限于内部项目的使用，所以采用**monorepo的开发模式**，把组件库、工具库、各个项目集中在一个仓库中，通过pnpm的workspaces特性，解决依赖安装和版本管理的问题。

    - jest单元测试
        - 因为组件库项目提供给多个项目使用，所以需要对组件库进行单元测试，保证组件库的质量。
        - 单元测试的代码覆盖率达到100%。

    - 引入自动化部署，解决项目部署的问题。
        - 。。。。。。。。






#### **遇到的困难**

在项目之间直接导入组件库项目的组件，会报错。提示jsx语法不支持。提交需要引入相应的loader进行处理。但其实项目中已经配置好了对应的loader。只是loader对外部的模块不起作用。

当时想到了几种解决办法：

方案一：在组件库项目中，提前打包好组件库，然后其他项目导入的模块是它已经打包好的组件。
弊端：组件库的组件发生变化，需要重新打包，其他项目才能使用最新的组件。无法做到实时更新。

方案二：启用webpack的模块联邦功能，把组件库项目作为一个远程模块，其他项目通过远程模块的方式引入组件库项目的组件。  
方案三：在组件库项目启用cicd，当组件发生变化。自动构建组件库。其实和方案一一样，只是打包流程变成了自动化。  
弊端：方案二三开发时，都要启动项目。

方案四：既然babel-loader不起效，那么就自己写一个loader。在用到组件库的项目中，添加自定义loader，对于来自uis的组件，使用@babel/core，设置react预设，进行转换。完美解决了问题，而又不会对组件库项目产生影响。