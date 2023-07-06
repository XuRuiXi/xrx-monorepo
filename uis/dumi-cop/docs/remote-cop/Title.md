---
nav: '远程组件库'

group: '展示组件'

title: 'Title'

toc: content
---


```jsx | pure
/**
  title: 基础使用
  description: 海口各个项目通用标题组件
*/
// 引入js文件
<script src="./hk-library.min.js"></script>
// 在window暴露了一个Title的组件
const { Title, ReactDOM } = hkLibrary;
// 通过ReactDOM.render方法渲染组件
ReactDOM.render(Title({ title: '标题' }), targetElement);
```