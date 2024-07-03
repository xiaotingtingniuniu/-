import Cookies from 'js-cookie';

import http from './http';
import session from '../utils/session';
import gio from '../thirdparty/gio';

/**
 * 登出
 */
export function logout() {
  gio.logout();
  Cookies.remove('auth');
  session.clearAll();
  window.location.replace('login.html');
}

/**
 * 查询用户支持品牌
 * @param options axios options [选填]
 * @see https://wiki.dataenlighten.com/pages/viewpage.action?pageId=2785336
 */
export function getBrandList(options) {
  return http.post('/service/common/vehicle/queryMyBrands', {}, options);
}

/**
 * 根据 VIN 返回销售车型主属性信息
 * @param {Object} params
 * @param {String} params.vinCode VIN
 * @param {String} params.quoteInfos 车辆主属性入参，无主属性默认入参："{}"
 * @param options axios options [选填]
 * @see https://wiki.dataenlighten.com/pages/viewpage.action?pageId=21169704
 */
export function getVehicle(params, options) {
  return http.post(
    '/service/common/vehicle/findSalesVehicleInterInfo',
    {
      ...params,
      hasVin: !!params.vinCode,
      hasPart: false,
    },
    options,
  );
}

/**
 * 根据 VIN 返回销售车型差异项信息
 * @param {Object} params
 * @param {String} params.vinCode VIN
 * @param {String} params.quoteInfos 车辆主属性入参，无主属性默认入参："{}"
 * @param options axios options [选填]
 * @see https://wiki.dataenlighten.com/pages/viewpage.action?pageId=21169710
 */
export function getVehicleHeterogeneity(params, options) {
  return http.post(
    '/service/common/vehicle/findSalesVehicleHeterogeneity',
    {
      ...params,
      hasVin: !!params.vinCode,
      hasPart: false,
    },
    options,
  );
}

/**
 * VIN 定型
 * @param {String} vinCode VIN
 * @param options axios options [选填]
 * @see https://wiki.dataenlighten.com/pages/viewpage.action?pageId=11403958
 */
export function queryVehicleByVIN(vinCode, options) {
  console.log('vinCode', vinCode);
  console.log('options', options);
  return http.post(
    '/ycyj/vehicle/findVehicleByVin',
    {
      vinCode,
      // partList: 1, // @龙泉：查总成局部会快些，后台需要用到
      includeParts: false,
    },
    options,
  );
}

/**
 * 无 VIN 的 OE 反查
 * @param {Object} params
 * @param {String} params.partNumber OE 号
 * @param {String} params.brand 品牌[选填]
 * @param options axios options [选填]
 * @see https://wiki.dataenlighten.com/pages/viewpage.action?pageId=23233111
 */
export function queryOE(params, options) {
  return http.post('/ycyj/part/queryPartByOeNoVin/m2', params, options);
}

/**
 * 查询用户支持品牌结构树
 * @param {String} maker 厂商 [选填]
 * @param options axios options [选填]
 * @see https://wiki.dataenlighten.com/pages/viewpage.action?pageId=21170407
 */
export function getUserBrandsTree(maker, options) {
  return http.post(
    '/service/common/brand/findSalesVehicleTree',
    {
      maker,
    },
    options,
  );
}
