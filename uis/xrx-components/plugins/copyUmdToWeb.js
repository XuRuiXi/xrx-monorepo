const path = require('path');
const fs = require('fs');

class copyUmdToWeb {
  constructor() {
    this.name = 'copyUmdToWeb';
  }
  apply(compiler) {
    compiler.hooks.done.tap(this.name, stats => {
      // 只有在打包umd的时候才会执行
      if (process.env.BUILD_TYPE !== 'umd') return;
      // __dirname表示当前文件所在的目录
      // process.cwd()表示当前命令行所在项目的根目录
      
      // 复制的目标目录
      const targetDir = path.resolve(process.cwd(), '../../packages/jqweb/public');
      // 获取到umd文件，然后复制到目标目录
      const umdPath = path.resolve(__dirname, '../lib/index.umd.js');
      fs.copyFileSync(umdPath, path.resolve(targetDir, './index.umd.js'));
    });
  }
}

module.exports = copyUmdToWeb;
