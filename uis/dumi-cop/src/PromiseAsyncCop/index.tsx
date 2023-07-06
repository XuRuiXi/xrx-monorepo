import React, { useEffect, useState } from "react";

const getName = () => {
  return new Promise((resolve) => {
    resolve('xrx');
  });
};

const PromiseAsyncCop = () => {
  const [name, setName] = useState('');
  useEffect(() => {
    getName().then((_name) => {
      setName(_name as string);
    });
  }, []);
  return (
    <div>姓名：{name}</div>
  );
};

export default PromiseAsyncCop;