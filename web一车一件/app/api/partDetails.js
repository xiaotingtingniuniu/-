import http from './http';

export default {
  /**
   * 批量图片名称查询装配图 M3
   * @param {Array<String>} imageNames 图片名称数组
   * @param {String} imagePrePath 图片存储路径前缀
   * @param {String} source 来源：0 = OE查询 1 = 结构树,2 = 其他
   */
  getPartThumb: async ({ imageNames, imagePrePath, source }, { cancelToken }) =>
    await http.post('/service/common/part/reqPartImage/m3', {
      imageNames,
      imagePrePath,
      source,
    }, {
      cancelToken,
    }),

  /**
   * 批量图片名称查询装配图 M3
   * @param {Object} vehicle 图片名称数组
   * @param {String} imageName 图片存储路径前缀
   * @param {Number} pageIndex 来源：0 = OE查询 1 = 结构树,2 = 其他
   * @param {Number} pageLimit 来源：0 = OE查询 1 = 结构树,2 = 其他
   */
  getPartListByVehicleImg: async ({ vehicle, imageName, pageIndex, pageLimit }, { cancelToken }) =>
    await http.post('/service/common/part/queryListByVehicleImg/m2', {
      vehicle,
      imageName,
      pageIndex,
      pageLimit,
    }, {
      cancelToken,
    }),
};
