import http from './http/login';

export default {
  /**
   * 获取短信验证码
   * @param {String} phoneNum 手机号
   */
  getMessageCode: async ({ phoneNum }) => {
    const params = new URLSearchParams();
    params.append('phoneNum', phoneNum);
    return await http.post('/oauth/sendMessage', params);
  },

  /**
   * 获取语音验证码
   * @param {String} phoneNum 手机号
   */
  getVoiceCode: async ({ phoneNum }) => {
    const params = new URLSearchParams();
    params.append('phoneNum', phoneNum);
    return await http.post('/oauth/sendVoice', params);
  },

  /**
   * 登录
   * @param {String} phoneNum 手机号
   * @param {String} code 输入的短信验证码
   */
  login: async ({ phoneNumber, verificationCode }) => {
    const params = { phoneNumber: phoneNumber, verificationCode: verificationCode };
    return await http.post('/ycyj/user/loginByPhoneNum', params);
  },

  /**
   * 注册
   * @param {String} phoneNumber 手机号
   * @param {String} verificationCode 验证码
   * @param {String} nickname 昵称
   */
  register: async ({ phoneNumber, verificationCode, nickname }) => {
    const params = { phoneNumber: phoneNumber, verificationCode: verificationCode, nickname: nickname };
    return await http.post('/ycyj/user/registering', params);
  },

  /**
   * 获取注册短信验证码
   * @param {String} phoneNum 手机号
   */
  getRegisterMessageCode: async ({ phoneNum }) => {
    const phoneNumber = phoneNum;
    return await http.get('/oauth/sendSmsCode?phoneNum=' + phoneNumber);
  },
  /**
   * 获取用户角色信息
   */
  getUserRole: async () => {
    console.log('获取用户角色信息');
    return await http.post('/ycyj/user/queryRoleDic');
  },
  /**
   * 获取省市信息
   * @see https://wiki.dataenlighten.com/pages/viewpage.action?pageId=5538233
   */
  getAllAreaInfo: async ({ dataVersion }) => {
    const params = {
      dataVersion: dataVersion,
    };
    return await http.post('/service/common/v3/system/queryAllAreaInfo', params);
  },
  /**
   * 完善个人信息
   * @param roleId 角色id
   * @param address 包含省份、市、区的对象
   * @param invitationCode 邀请码
   */
  perfectUserInfo: async ({ roleId, address, inviteCode }) => {
    const params = {
      province: address.province,
      city: address.city,
      district: address.district,
      inviteCode: inviteCode,
      roleId: roleId,
    };
    return await http.post('/ycyj/user/perfectUserInfo', params);
  },
};
