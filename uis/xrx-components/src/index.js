import '../public-path.js';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Modal, Input as Input2 } from 'antd';
import styles from './index.less';
import img from '../assets/iTab-0.jpg';
const packageName = require('../package.json').name;

import { BrowserRouter, useRoutes, Link } from 'react-router-dom';

import Table from '@@/components/Table';
import Input from '@@/components/Input';

const Root = (props) => {
  const [data, setData] = React.useState(props.data);
  props?.onGlobalStateChange?.(
    (state, prev) => {
      console.log(`[onGlobalStateChange - ${packageName}]:`, state, prev);
      setData(state.data);
    },
  );
  return (
    <div className={styles.root}>
      <Pages data={data} />
    </div>
  );
};

const Pages = (props) => {
  const { data } = props;
  const element = useRoutes([
    {
      path: '/',
      element: <App data={data} />,
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



const App = (props) => {
  const { data } = props;

  const showModal = () => {
    Modal.info({
      title: '主应用数据',
      // 修改挂载的dom
      // getContainer: () => document.querySelector('#__qiankun_microapp_wrapper_for_react_app__').shadowRoot.querySelector("#modal"),
      content: data,
    });
  };

  return (
    <div className={styles.root}>
      <div id="modal"></div>
      <Input2 />
      {data}
      <img src={img} alt='风景照' onClick={showModal} />
    </div>
  );
};

let root = null;

function render(props) {
  // 这个container是shadow dom的实例（shadowRoot）
  const { container } = props;
  // 还有shadow dom的情况
  root = createRoot(container ? container.querySelector('#app') : document.querySelector('#app'));
  root.render(
    <React.StrictMode>
      <BrowserRouter basename={window.__POWERED_BY_QIANKUN__ ? '/app-react' : '/'}>
        <Link to="/input">input</Link> |
        <Link to="/table">table</Link> |
        <Link to="/">home</Link> |
        <Root {...props} />
      </BrowserRouter>
    </React.StrictMode>
  );
}

if (!window.__POWERED_BY_QIANKUN__) {
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
  props.onGlobalStateChange(
    (state, prev) => {
      console.log(`[onGlobalStateChange - ${packageName}]:`, state, prev);
    },
  );
  render(props);
}

export async function unmount(props) {
  root.unmount();
}

