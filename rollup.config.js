import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import vue from 'rollup-plugin-vue2';
import css from 'rollup-plugin-css-only';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.js', // 你的组件入口文件
  output: {
    file: 'dist/index.js', // 打包后的文件
    format: 'esm', // 设置模块化格式，esm 为 ES Module
  },
  plugins: [
    vue({
      compileTemplate: true, // 显式地将模板编译为渲染函数
    }),
    css(),
    resolve({
      extensions: ['.mjs', '.js', '.jsx', '.json', '.node', '.vue'], // 在这里指定你需要处理的文件扩展名
    }),
    commonjs(),
    // terser() 
  ],
  external: ['vue', 'lodash'], // 声明 vue 为外部依赖，防止 vue 被打包进最后的文件
};
