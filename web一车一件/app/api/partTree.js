import http from './http';

export default {
  /**
   * 查询配件结构树
   * @param {String} firstLevelId 一级 id
   * @param {String} secondLevelId 二级 id
   * @param {String} vinCode VIN
   * @param {String} optionCode 当前车辆的 optionCode
   * @param {String} mjsid mjsid
   */
  getPartTreeByPage: async ({ firstLevelId, secondLevelId, vinCode, mjsid, optionCode, prefix }, { cancelToken }) =>
    await http.post('/ycyj/part/findPartTree', {
      vinCode,
      mjsid,
      firstLevelId,
      secondLevelId,
      optionCode,
      prefix,
    }, {
      cancelToken,
    }),
};
