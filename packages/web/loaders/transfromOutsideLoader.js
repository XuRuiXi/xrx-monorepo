function transfromOutsideLoader(scorce, map, meta) {
  var callback = this.async();
  if (this.resourcePath.includes('xrx-components')) {
    const ast = require('@babel/core').transformSync(scorce, {
      presets: ['@babel/preset-react'],
    });
    callback(null, ast.code, map, meta);
  } else {
    callback(null, scorce, map, meta);
  }
}

module.exports = transfromOutsideLoader;