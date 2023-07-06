import React from 'react';
import Tabs from '../../components/Tabs';


function Wrapper({
  items,
  onChange,
}) {
  return (
    <Tabs items={items} onChange={onChange} />
  );
}

export default Wrapper;
