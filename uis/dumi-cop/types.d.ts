// 声明less
declare module '*.less' {
  const less: { readonly [key: string]: string };
  export default less;
}