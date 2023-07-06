import React, { useEffect, useState } from 'react';

const FetchCop = () => {
  const [name, setName] = useState('');
  useEffect(() => {
    async function fetchData() {
      const response = await fetch('http://175.178.81.246:443/api/getAllFile');
      const result = await response.json();
      setName(typeof result === 'string' ? result : JSON.stringify(result));
    }
    fetchData();
  }, []);

  return (
    <div>
      姓名：{name}
    </div>
  );
};

export default FetchCop;