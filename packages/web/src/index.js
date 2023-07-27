import React from 'react';
import { createRoot } from 'react-dom/client';
import './public.css';
import styles from './index.less'; 
import Home from './pages/Home';
import AppJquery from './pages/App-jquery';
import AppReact from './pages/App-react';
import { clone } from '@self/util';
import Aa from '@self/xrx-components/components/Table';
import Table from './pages/Table';
import { registerMicroApps, start, initGlobalState } from 'qiankun';

import { BrowserRouter, useRoutes, Link } from 'react-router-dom';

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

// 监听数据变更
actions.onGlobalStateChange((state, prev) => {
  // state: 变更后的状态; prev 变更前的状态
  console.log('我是主应用：', state, prev);
});

registerMicroApps([
  {
    name: 'jqueryApp',
    entry: 'http://localhost:8081/',
    container: '#qiankun',
    activeRule: '/app-jquery',
  },
  {
    name: 'reactApp',
    entry: 'http://localhost:8082',
    // entry: 'http://localhost:8080/public/index.html',
    container: '#reactQiankun',
    activeRule: '/app-react',
    props: initialState
  },
]);
// start({ singular: true })  是否为单例模式
// 启动 qiankun
start({
  sandbox: {
    // strictStyleIsolation: true,
    // experimentalStyleIsolation: true,
  }
});

const App = () => {
  const ref = React.useRef(null);

  return (
    <>

      <div id="reactQiankun" />
      <div className={styles.root}>
        <button
          onClick={() => {
            ref.current.remove();
          }}>
        Remove from the DOM
        </button>
        <Home ref={ref} />
        {clone(111)}
        <Aa />
      </div>
    </>
  );
};


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