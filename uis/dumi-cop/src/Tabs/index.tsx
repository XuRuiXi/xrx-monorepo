import React, { useState } from 'react';
import { Tabs } from 'antd';
// 导入antd Tabs组件属性ItemProps
import { TabsProps } from 'antd/lib/tabs';


const _Tabs = (props: TabsProps) => {
  const { items, ...other } = props;
  // 当前的tabkey
  const [activeKey, setActiveKey] = useState('1');
  const _items = [
    {
      key: '1',
      label: `Tab 1`,
      children: `Content of Tab Pane 1`,
    },
    {
      key: '2',
      label: `Tab 2`,
      children: `Content of Tab Pane 2`,
    },
    {
      key: '3',
      label: `Tab 3`,
      children: `Content of Tab Pane 3`,
    },
  ];
  return (
    <div>
      <div id="activeKey">
        目前显示的tabkey是：{activeKey}
      </div>
      <Tabs
        activeKey={activeKey}
        items={items || _items}
        onChange={(key) => {
          setActiveKey(key);
        }}
        {...other}
      />
    </div>
  );
};

export default _Tabs;