type O = { [key: string]: any };

export const omit = (obj: O, keys: string[]) => {
  return Object.keys(obj).reduce((target: O, key) => {
    if (!keys.includes(key)) {
      target[key] = obj[key];
    }
    return target;
  }, {});
};

export const pick = (obj: O, keys: string[]) => {
  return Object.keys(obj).reduce((target: O, key) => {
    if (keys.includes(key)) {
      target[key] = obj[key];
    }
    return target;
  }, {});
};
