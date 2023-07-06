import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './public.css';
import styles from './index.less'; 
import Home from './pages/Home';
import { clone } from '@self/util';
import Aa from '@self/xrx-components/components/Table';
import { SWRConfig } from 'swr';

const App = () => {
  const ref = React.useRef(null);
  useEffect(() => {
    console.log('App mounted');
    return () => {
      console.log('App unmounted');
    };
  }, []);
  
  return (
    <div className={styles.root}>
      <button
        onClick={() => {
          ref.current.remove();
        }}>
        Remove from the DOM
      </button>
      <SWRConfig>
        <Home ref={ref} />
      </SWRConfig>
      {clone(111)}
      <Aa />
    </div>
  );
};

createRoot(document.querySelector('#app')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
