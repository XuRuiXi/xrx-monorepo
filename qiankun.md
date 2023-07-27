### 项目架构（基于qiankun@2和react@18）
- qiankun版本：qiankun@2.10.11
- react版本：react@18
- 基座：packages/web
- 子应用一：packages/jqweb (jquery项目)
- 子应用二：uis/xrx-components (react项目)

### 主应用准备

- **注册/启动** 子应用
```js
import { registerMicroApps, start } from 'qiankun';
/* 
  activeRule: 子应用的激活规则，当主应用的路由发生变化时，会去匹配子应用的activeRule，匹配上了就会加载对应的子应用。
  container: 子应用的挂载节点，子应用会被挂载到这个节点上。
  entry: 子应用的入口地址。
  name: 子应用的名称，微前端的微应用的唯一标识，微应用之间必须确保唯一。
*/
registerMicroApps([
  {
    name: 'app-jquery',
    entry: 'http://localhost:8080/',
    container: '#qiankun',
    activeRule: '/app-jquery',
  },
  {
    name: 'app-react',
    entry: 'http://localhost:8081',
    // entry: 'http://localhost:8080/public/index.html',
    container: '#reactQiankun',
    activeRule: '/app-react',
  },
]);

// 启动 qiankun
start();

const Pages = () => {
  const element = useRoutes([
    {
      path: '/',
      element: <App />,
    },
    {
      path: '/table',
      element: <Table />,
    },
    {
      path: '/app-jquery',
      element: <AppJquery />,
    },
    {
      path: '/app-react/*',
      element: <AppReact />,
    }
  ]);
  return element;
};


createRoot(document.querySelector('#app')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Pages />
    </BrowserRouter>
  </React.StrictMode>
);
```

一般情况下，推荐给每个子应用单独创建一个路由，这样可以更好的控制子应用的路由，同时也可以避免子应用的路由和主应用的路由冲突。

### 子应用准备（基于webpack打包）

- 在入口文件导出生命周期钩子
```js
// 存储子应用实例，方便卸载时执行root.unmount();
let root = null;
function render(props) {
  // 根据container判断是否是主应用渲染
  const { container } = props;
  root = createRoot(container ? container.querySelector('#app') : document.querySelector('#app'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

if (!window.__POWERED_BY_QIANKUN__) {
  // 独立运行
  render({});
}

// 本地开发时，如果启动方式不是rescripts，主应用获取不到暴露的方法，所以需要手动挂载
if (process.env.NODE_ENV === 'development') {
  window[`${packageName}-main`] = {
    bootstrap,
    mount,
    unmount,
  };
}

export async function bootstrap() {
  console.log('[react18] react app bootstraped');
}

export async function mount(props) {
  console.log('[react18] props from main framework', props);
  render(props);
}

export async function unmount(props) {
  const { container } = props;
  console.log(container);
  root.unmount();
}

```

- 新建public-path.js文件，用于设置子应用的publicPath。在子应用的入口文件顶部中引入该文件。

./public-path.js
```js
if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
```

./src/index.js
```js
// 导入跟文件，是为了静态资源的路径和主应用中设置的entry一致（不然会出现资源加载不到的问题）
import '../public-path.js';
...
```


- 修改webpack配置，设置打包的library和libraryTarget
```js
const packageName = require('../package.json').name;

output: {
  library: `${packageName}-[name]`,
  libraryTarget: 'umd',
  globalObject: 'window',
},
```


### 路由接入

- 主应用中接入路由

**子应用的path后面必须要加上/*，否则会出现子应用的路由无法匹配的问题。**
```js
const Pages = () => {
  const element = useRoutes([
    {
      path: '/',
      element: <App />,
    },
    {
      path: '/table',
      element: <Table />,
    },
    {
      path: '/app-jquery',
      element: <AppJquery />,
    },
    {
      /* important */
      path: '/app-react/*',
      element: <AppReact />,
    }
  ]);
  return element;
};
createRoot(document.querySelector('#app')).render(
  <React.StrictMode>
    <BrowserRouter>
      <div>
        <Link to="/">Home</Link> | 
        <Link to="/table">Table</Link> | 
        <Link to="/app-jquery">app-jquery</Link> | 
        <Link to="/app-react">app-react</Link>
      </div>
      <Pages />
    </BrowserRouter>
  </React.StrictMode>
);
```

- 子应用中接入路由(重点介绍history模式)

路由的basename根据子应用在主应用中的path来设置，如果子应用的path是/app-react，那么basename就是/app-react。
如果不是主应用渲染，那么就是独立运行，basename就是/。

```js
const Pages = () => {
  const element = useRoutes([
    {
      path: '/',
      element: <App />,
    },
    {
      path: '/table',
      element: <Table />,
    },
    {
      path: '/input',
      element: <Input />,
    },
  ]);
  return element;
};
const App = () => {
  return (
    <div className={styles.root}>
      <img src={img} alt='风景照' />
    </div>
  );
};

let root = null;

function render(props) {
  const { container } = props;
  // 还有shadow dom的情况
  root = createRoot(container ? container.querySelector('#app') : document.querySelector('#app'));
  root.render(
    <React.StrictMode>
      <BrowserRouter basename={window.__POWERED_BY_QIANKUN__ ? '/app-react' : '/'}>
        <Link to="/input">input</Link> |
        <Link to="/table">table</Link> |
        <Link to="/">home</Link> |
        <Pages />
      </BrowserRouter>
    </React.StrictMode>
  );
}
```


### 应用间通信

- 在注册时可以传入props，这样在子应用中就可以通过props获取到主应用传递的数据。
```js
// 主应用
registerMicroApps([
  {
    name: 'reactApp',
    entry: 'http://localhost:8081',
    container: '#reactQiankun',
    activeRule: '/app-react',
    props: {
      data: '初始化数据'
    }
  },
]);
```

子应用在props中获取到数据
```js
// 子应用
export async function mount(props) {
  console.log('[react18] props from main framework', props);
  console.log(props.data);
  render(props);
}
```

- 触发数据的改变和监听数据的改变

主应用触发
```js
// 触发
import { initGlobalState } from 'qiankun';
// 初始化 state
const initialState = {
  data: '我是主应用传递的数据'
};
// 初始化 actions
const actions = initGlobalState(initialState);
// 发送数据变更
setTimeout(() => {
  actions.setGlobalState({
    data: '我是改变之后的数据'
  });
}, 3000);
```

子应用监听
```js
// 传入的props中有onGlobalStateChange方法，可以监听数据的变化
export async function mount(props) {
  console.log('[react18] props from main framework', props);
  props.onGlobalStateChange(
    (state, prev) => {
      console.log(`[onGlobalStateChange - ${packageName}]:`, state, prev);
    },
  );
  render(props);
}
```

### qiankun的js沙箱原理

1、快照沙箱

- 劣势1：遍历window对象上的所有属性，性能差
- 劣势2：同一时间只能激活一个微应用

解析：快照沙箱的原理是在微应用激活时，记录下window上的所有属性，然后在微应用卸载时，将window上的属性恢复为激活时的值。

```js
// 记录不可修改的全局变量
const rawWindow = ['TEMPORARY', 'PERSISTENT'];

class SnapshotSandbox {
  windowSnapshot = {};
  modifyPropsMap = {};
  active() {
    // 保存window快照
    this.windowSnapshot = { ...window };
    // 恢复上一次在运行该微应用的时候所修改过的window属性
    Object.keys(this.modifyPropsMap).forEach((prop) => {
      window[prop] = this.modifyPropsMap[prop];
    });
  }
  inactive() {
    for (const prop in window) {
      // 当前window上的属性，不等于快照中的属性，那么表示该属性是在微应用运行过程中被修改的
      if (window[prop] !== this.windowSnapshot[prop] && !rawWindow.includes(prop)) {
        // 记录修改了window上的哪些属性
        this.modifyPropsMap[prop] = window[prop];
        // 将window属性恢复为快照中的值
        window[prop] = this.windowSnapshot[prop];
      }
    }
  }
}

// 验证
const sandbox = new SnapshotSandbox();
window.a = 1;
window.b = 2;
console.log(window.a, window.b); // 1 2
sandbox.active();
window.a = 3;
window.b = 4;
console.log(window.a, window.b); // 3 4
sandbox.inactive();
console.log(window.a, window.b); // 1 2
sandbox.active();
console.log(window.a, window.b); // 3 4
```

2、Proxy沙箱

- 优势1：性能好
- 优势2：可以同时激活多个微应用

解析：Proxy沙箱的原理是在微应用激活时，创建一个代理对象，查找属性时，先查找代理对象上的属性，如果没有找到，再去查找window上的属性。在激活状态时，只会修改代理对象上的属性，不会修改window上的属性。

```js
class ProxySandbox {
  proxy;
  isRunning = true;
  active() {
    this.isRunning = true;
  }
  inactive() {
    this.isRunning = false;
  }
  constructor() {
    const fakeWindow = {};
    this.proxy = new Proxy(fakeWindow, {
      set: (target, prop, value) => {
        if (this.isRunning) target[prop] = value;
      },
      get: (target, prop) => {
        return prop in target ? target[prop] : window[prop];
      },
    });
  }
}

// 验证
window.city = '北京';
const sandbox1 = new ProxySandbox();
const sandbox2 = new ProxySandbox();
sandbox1.active();
sandbox2.active();
sandbox1.proxy.city = '上海';
sandbox2.proxy.city = '广州';
console.log(window.city); // 北京
console.log(sandbox1.proxy.city); // 上海
console.log(sandbox2.proxy.city); // 广州
sandbox1.inactive();
sandbox2.inactive();
sandbox1.proxy.city = '深圳';
sandbox2.proxy.city = '杭州';
console.log(window.city); // 北京
console.log(sandbox1.proxy.city); // 上海
console.log(sandbox2.proxy.city); // 广州
sandbox1.active();
sandbox2.active();
sandbox1.proxy.city = '深圳';
sandbox2.proxy.city = '杭州';
console.log(window.city); // 北京
console.log(sandbox1.proxy.city); // 深圳
console.log(sandbox2.proxy.city); // 杭州
```


### qiankun微服务原理

1、首先主应用要监听路由的变化，当路由发生变化时，会去匹配子应用的activeRule，匹配上了就会加载对应的子应用。
  - 监听popstate事件
  ```js
  window.addEventListener('popstate', () => {
    // 在这里match activeRule，然后加载对应的子应用
    // ...
  });
  ```
  - 监听pushState事件
  ```js
  const originalPushState = window.history.pushState;
  window.history.pushState = function pushState(...args) {
    // 修正originalPushState的this指向
    const result = originalPushState.apply(window.history, args);
    // 在这里match activeRule，然后加载对应的子应用
    // ...
    return result;
  };
  ```

2、加载子应用
通过插件import-html-entry，获取到子应用的html文本、css、js等资源，然后通过eval执行js代码，最后将子应用挂载到主应用中。
```js
// 获取子应用的html文本、css、js等资源
const { template, execScripts, assetPublicPath } = await importHtmlEntry(entry);
// 插入template到container中
container.innerHTML = template;
// 执行子应用的js代码
await execScripts();
```

3、实现js代码隔离原理
  - 通过bind方法，让子应用的this指向proxy对象。然后再通过with语法，将proxy对象绑定到子应用的执行上下文中。
```js
window.proxy = (new ProxySandbox()).proxy;
// 让proxy的window属性等于自己本身
window.proxy.window = window.proxy;
(function () {
  with(this) {
    // 解构出来之后，window就是proxy，所以window.aaa = 111111，就相当于proxy.aaa = 111111。
    const { window }=this;
    window.aaa = 111111;
    console.log(window); // Proxy
  }
}).bind(window.proxy)();

```




### qiankun2种css沙箱的实现方式

strictStyleIsolation——严格沙箱模式
experimentalStyleIsolation——实验性沙箱模式

```js
start({
  sandbox: {
    // strictStyleIsolation: true,
    // experimentalStyleIsolation: true,
  }
});
```
- strictStyleIsolation：该模式下，会将子应用的内容放在shadow dom中，实现css隔离。
- experimentalStyleIsolation：该模式下，会对所有子应用的样式添加一个前缀，实现css隔离。




### qiankun使用过程中存在的几个问题和解决方案

1、在部分旧项目中，例如声明了 var a = 1; 另外一个文件console.log(a)。如果是微应用引入的方式，这样是会报错的，因为此时js文件的内容已经形成了一个闭包，该变量存在于函作用域中，外部无法访问。

2、在开启沙箱的strictStyleIsolation、experimentalStyleIsolation模式之后，挂载在body上的样式会失效。解决方案是将dom挂载到子应用的根节点上。

3、项目中静态资源路径改造出现404
  - 在webpack打包的项目中，可以在根目录新建public-path.js文件，然后在入口文件顶部中引入该文件。原理是动态设置webpack的publicPath。
  ```js
  // public-path.js
  if (window.__POWERED_BY_QIANKUN__) {
    __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
  }
  ```

  - css中图片和字体的路径改造
    - 将静态资源上传cdn/服务器。直接引入完整的url路径。
    - 通过 url-loader或者webpack的assets模块，将图片和字体转换成base64编码（只适用于小图片和小字体）。
    - 通过webpack的file-loader，将图片和字体打包到指定的目录，然后通过publicPath设置静态资源的路径。
    ```js
    // webpack.config.js
    module.exports = {
      output: {
        publicPath: 'http://cdn.example.com/assets/', // cdn地址
      },
      module: {
        rules: [
          {
            test: /\.(png|jpg|gif)$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: '[name].[ext]',
                  outputPath: 'images/', // 图片打包后存放的目录
                },
              },
            ],
          },
          {
            test: /\.(eot|ttf|woff|woff2|svg)$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: '[name].[ext]',
                  outputPath: 'fonts/', // 字体打包后存放的目录
                },
              },
            ],
          },
        ],
      },
    };
    ```

4、子应用静态资源需要支持跨域。