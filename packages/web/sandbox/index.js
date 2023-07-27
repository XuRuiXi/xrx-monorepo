/* 快照沙箱 */

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
/* const sandbox = new SnapshotSandbox();
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
console.log(window.a, window.b); // 3 4 */


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


// 验证
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