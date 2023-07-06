import React from 'react';
import { createRoot } from 'react-dom/client';
import styles from './index.less';

import Table from '@@/components/Table';

const App = () => {
  return (
    <div className={styles.root}>
      <Table />
    </div>
  );
};

createRoot(document.querySelector('#app')).render(<App />);
