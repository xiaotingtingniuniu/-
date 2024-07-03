import { session_types, session_excludes } from '../config/constant';

const clearByKeys = keys => {
  keys.forEach(key => {
    if (session_excludes.includes(key)) {
      return;
    }

    sessionStorage.removeItem(key);
  });
};

const clearAll = () => {
  Object.values(session_types).forEach(key => {
    sessionStorage.removeItem(key);
  });
};

export default {
  clearByKeys,
  clearAll,
};
