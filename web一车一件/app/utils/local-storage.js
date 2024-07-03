const set = (name, val) => {
  const json = JSON.stringify(val);

  localStorage.setItem(name, json);
};

const get = (name, key, keyVal, target) => {
  const json = localStorage.getItem(name);

  if (!json) {
    return '';
  }

  const o = JSON.parse(json);

  if (key && keyVal && Array.isArray(o)) {
    return getByKey(o, name, key, keyVal, target);
  }

  return o;
};

const getByKey = (o, name, key, keyVal, target) => {
  const item = o.find(item => item[key] === keyVal);

  if (!item) {
    return;
  }

  add(name, key, item);

  if (target && item) {
    return item[target];
  }

  return item;
};

const MAX_COUNT = 3;

const add = (name, key, val) => {
  let arr = (get(name) || []).filter(item => item[key] !== val[key]);

  arr.push({
    ...val,
    t: new Date().getTime(),
  });

  arr = arr.sort((a, b) => b.t - a.t).slice(0, MAX_COUNT);

  set(name, arr);
};

export { set, get, add };
