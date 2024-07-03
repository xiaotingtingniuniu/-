import http from './http';
import httpH5 from './http/app';
import { getFormattedDate } from '../utils/date';

/**
 * 获取当前用户的积分、减损金额、勋章状态等信息
 * @param options axios options [选填]
 * @see https://wiki.dataenlighten.com/pages/viewpage.action?pageId=5538295
 */
export function getUserCenterInfo(options) {
  return http.post('/product/ycyj/person/queryPersonInfo', {}, options);
}

/**
 * 获取当前用户的积分记录
 * @param {Object} params
 * @param {String} params.userId 当前用户的 uid
 * @param {String} params.queryTime 起始时间
 * @param {String} params.pageCount 每页记录条数
 * @param options axios options [选填]
 * @see https://wiki.dataenlighten.com/pages/viewpage.action?pageId=5538041
 */
export function getUserPointHistory(params, options) {
  return http.post(
    '/oauth/integral/list',
    {
      userId: params.userId,
      queryTime: params.queryTime || getFormattedDate(new Date().getTime()),
      pageCount: params.pageCount,
    },
    options,
  );
}

/**
 * 根据code类型查询增加积分
 * @param {Object} params
 * @param {String} params.type 积分类型 - '登陆' | 'vin查询' | 'oe查询' | '江湖名查询'
 * @param {String} params.vinCode 当 type 类型为 VIN 查询时，需要上传 vinCode
 * @param {String} params.partNumber 当 type 类型为 OE 查询时，需要上传配件 OE
 * @see https://wiki.dataenlighten.com/pages/viewpage.action?pageId=5538063
 */
export function addPointByType(params) {
  return http.post('/product/ycyj/integral/addIntegralByType', params);
}

/**
 * 查询用户信息
 * @see https://wiki.dataenlighten.com/pages/viewpage.action?pageId=5538193
 */
export function getUserInfo(params) {
  return http.post('/ycyj/user/detail', params);
}

/** H5内的查询用户信息(app内传token)*/
export function getUserInfoH5(params) {
  return httpH5.post('/ycyj/user/detail', params);
}

/**
 * 获取当前角色信息
 */
export function getRoleDicCurrent(params) {
  return http.post('/ycyj/user/queryRoleDicCurrent', params);
}

/**
 * 修改用户信息查询
 * @param {Object} params
 * @param {String} params.userId 用户 ID
 * @param {String} params.provinceId 省份 ID
 * @param {String} params.cityName 市
 * @param {String} params.sex 性别
 * @param {String} params.birthday 生日
 * @param {String} params.job 职位
 * @param options axios options [选填]
 * @see https://wiki.dataenlighten.com/pages/viewpage.action?pageId=27002981
 */
export function updateUserInfo(params) {
  return http.post('/ycyj/user/update', params);
}

/**
 * 获取省市信息
 * @see https://wiki.dataenlighten.com/pages/viewpage.action?pageId=5538233
 */
export function getAllAreaInfo(params) {
  return http.post('/service/common/v3/system/queryAllAreaInfo', params);
}

/**
 * 获取用户邀请码
 * @see https://wiki.dataenlighten.com/pages/viewpage.action?pageId=11414591
 */
export function queryInviteCode() {
  return http.post('/ycyj/user/queryInviteCode', {});
}
