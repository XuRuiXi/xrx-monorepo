const render = ($) => {
  // $('#purehtml-container').html('Hello, render with jQuery');
  return Promise.resolve();
};

((global) => {
  global['purehtml'] = {
    bootstrap: () => {
      return Promise.resolve();
    },
    mount: (props) => {
      // 监听数据变更
      props.onGlobalStateChange((state, prev) => {
        // state: 变更后的状态; prev 变更前的状态
        console.log('我是jquery子应用：', state, prev);
      });
      return render($);
    },
    unmount: () => {
      return Promise.resolve();
    },
  };
})(window);
