import Vue from 'vue';

import { getTimer } from './timer';

const timer = getTimer();

let message = null;
let messageCount = 0;

const show = () => {
  timer.start(() => {
    if (!message) {
      message = Vue.prototype.$message({
        message: '网速不太给力，请检查网络',
        center: true,
        showClose: true,
        duration: 0,
      });
    }
    messageCount++;
  }, 10e3);
};

const hide = () => {
  timer.clear();

  if (messageCount > 0) {
    messageCount--;
  }

  if (!messageCount && message) {
    message.close();
    message = null;
  }
};

export { show, hide };
