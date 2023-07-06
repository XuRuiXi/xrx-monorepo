import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { Button } from 'antd';
import useSWR, { mutate } from 'swr';

export default forwardRef(function Counter(props, fatherRef) {
  const [show, setShow] = useState(true);
  const ref = React.useRef(null);

  const fetcher = p => {
    return fetch(p[0]).then(r => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(r.json());
        }, 1000);
      });
    });
  };




  const { data, error, isLoading } = useSWR(['http://175.178.81.246:443/api/getAllFile', show], fetcher);
  console.log(data, error, isLoading, 1111);
  useImperativeHandle(fatherRef, () => ({
    remove: () => {
      ref.current.remove();
    },
  }));

  const send = () => {
    mutate(['http://175.178.81.246:443/api/getAllFile', show]);
  };

  return (
    <div>
      <button
        onClick={() => {
          setShow(!show);
        }}>
        Toggle with setState
      </button>
      {show && <p ref={ref}>Hello world</p>}
      <Button
        onClick={send}
      >
        发送请求
      </Button>
    </div>
  );
});

