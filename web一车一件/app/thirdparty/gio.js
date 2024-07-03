import Cookies from 'js-cookie';

export default {
  login() {
    const auth = Cookies.getJSON('auth');
    gio('setUserId', auth.phoneNumber);
  },
  logout() {
    gio('clearUserId');
  },
  goWeixin() {
    gio('track', 'web_banner_click');
  },
  partTreePage() {
    gio('track', 'App_first_level_page');
  },
  quotedRemark() {
    gio('track', 'gio_note_after');
  },
  goQuoted() {
    gio('track', 'gio_edit_price');
  },
};
