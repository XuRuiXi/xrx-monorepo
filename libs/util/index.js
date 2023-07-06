import loadsh from 'loadsh';

export const clone = (obj) => {
  return loadsh.cloneDeep(obj);
}
