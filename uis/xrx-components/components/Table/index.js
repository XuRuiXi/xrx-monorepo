import React from 'react';
import { Table } from 'antd';
import styles from './index.less';

const _Table = () => {
  const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Age', dataIndex: 'age' },
    { title: 'Sex', dataIndex: 'sex' },
    { title: '666', dataIndex: '666' },
  ];
  const data = [
    {name: '11', age: '22', sex: '33'}
  ];
  return (
    <div className={`${styles.root} 1111111`}>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="name"
      />
    </div>
  );
};

export default _Table;