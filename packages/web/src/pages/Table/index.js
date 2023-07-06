import React from 'react';
// import { createRoot } from 'react-dom/client';
import { Table } from 'antd';

const _Table = () => {
  console.log('Table');
  const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Age', dataIndex: 'age' },
    { title: 'Sex', dataIndex: 'sex' },
  ];
  const data = [
    {name: '11', age: '22', sex: '33'}
  ];
  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="name"
      />
    </div>
  );
};

// export default dom => {
//   createRoot(dom).render(<_Table />);
// };

export default _Table;