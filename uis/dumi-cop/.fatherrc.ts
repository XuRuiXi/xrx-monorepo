import { defineConfig } from 'father';

export default defineConfig({
  // more father config: https://github.com/umijs/father/blob/master/docs/config.md
  esm: { output: 'dist' },
  // 配置入口文件
  // 打包成umd格式
  umd: {
    name: 'hkLibrary',
    entry: 'src/index.umd.ts',
  },
});
