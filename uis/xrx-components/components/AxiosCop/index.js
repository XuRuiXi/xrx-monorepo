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