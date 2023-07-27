import React, { useImperativeHandle, forwardRef, useState } from 'react';

export default forwardRef(function Counter(props, fatherRef) {
  const [show, setShow] = useState(true);
  const ref = React.useRef(null);

  useImperativeHandle(fatherRef, () => ({
    remove: () => {
      ref.current.remove();
    },
  }));

  return (
    <div>
      <button
        onClick={() => {
          setShow(!show);
        }}>
        Toggle with setState
      </button>
      {show && <p ref={ref}>Hello world</p>}
    </div>
  );
});

