import React from 'react';

const Input = props => {
  const {
    onChange,
  } = props;
  return <input onChange={onChange} id='input' />;
};

export default Input;