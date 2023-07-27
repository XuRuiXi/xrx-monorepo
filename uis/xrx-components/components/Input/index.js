import React from 'react';

const Input = props => {
  React.useEffect(() => {
    console.log('input mount');
    return () => {
      console.log('input unmount');
    };
  }, []);
  const {
    onChange = () => {},
  } = props;
  return <input onChange={onChange} id='input' />;
};

export default Input;