import React, { useEffect } from 'react';
import axios from 'axios';

const AxiosCop = () => {
  const [name, setName] = React.useState('');
  const [age, setAge] = React.useState('');
  const getName = () => {
    axios.get('/api/name').then(res => {
      setName(res as unknown as string);
    });
  };
  const getAge = () => {
    axios.get('/api/age').then(res => {
      setAge(res as unknown as string);
    });
  };
  useEffect(() => {
    getAge();
  }, []);
  return (
    <div>
      <div>姓名：{name}</div>
      <div>年龄：{age}</div>
      <button onClick={getName} type='button'>获取姓名</button>
    </div>
  );
};

export default AxiosCop;