import React, { useEffect, useState } from 'react';

const FetchCop = () => {
  const [name, setName] = useState('');
  useEffect(() => {
    async function fetchData() {
      const response = await fetch('https://example.com/data.json');
      const result = await response.json();
      setName(result);
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