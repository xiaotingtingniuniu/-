import Cookies from 'js-cookie';

import { SOBOT_URL } from 'config';

const SCRIPT_ID = 'zhichiScript';
const CUSTOM_BTN_ID = 'zhiCustomBtn';

function init() {
  if (document.getElementById(SCRIPT_ID)) {
    return;
  }

  const s = document.createElement('script');
  s.type = 'text/javascript';
  s.async = true;
  s.src = `${SOBOT_URL}/chat/frame/js/entrance.js?sysNum=1dbccbc4778b4c64802464b416802f67`;
  s.classList.add('zhiCustomBtn');
  s.id = SCRIPT_ID;
  s.dataset.args = 'manual=true';
  s.onload = onJSload;
  document.body.appendChild(s);
  appendCustomBtn();
}

function onJSload() {
  if (window.getzhiSDKInstance) {
    const zhiManager = window.getzhiSDKInstance();

    zhiManager.on('load', () => {
      zhiManager.initBtnDOM();
      const zhichiBtnBox = document.getElementById('zhichiBtnBox');
      if (zhichiBtnBox) {
        zhichiBtnBox.style.display = 'none';
      }
    });

    const auth = Cookies.getJSON('auth');
    const { userName, uid, phoneNumber, company } = auth;

    zhiManager.set('customBtn', 'true');
    zhiManager.set('userinfo', {
      partnerId: uid,
      tel: phoneNumber,
      realname: userName,
      remark: company,
    });
  }
}

function appendCustomBtn() {
  if (document.getElementById(CUSTOM_BTN_ID)) {
    return;
  }

  const customBtn = document.createElement('div');
  customBtn.id = CUSTOM_BTN_ID;
  customBtn.className = 'zhiCustomBtn btn-service';

  const i = document.createElement('i');
  i.className = 'el-icon-service';

  const text = document.createElement('div');
  text.className = 'zhiCustomBtn_text';
  text.innerText = '联系客服';

  customBtn.appendChild(i);
  customBtn.appendChild(text);

  document.body.appendChild(customBtn);
}

export default { init };
