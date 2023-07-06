import React from 'react';

interface InputProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = (props: InputProps) => {
  const {
    onChange,
  } = props;
  return <input onChange={onChange} id='input' />;
};

export default Input;