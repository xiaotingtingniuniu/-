import http from './http';

export default {
  /**
   * 通过关键词 (OE 或者配件名) 查询属于特定 VIN 的配件
   * @param {String} vinCode VIN
   * @param {String} optionCode 当前车辆的 optionCode
   * @param {String} key 关键词
   * @param {String} mjsid mjsid
   */
  queryPartsByKey: async ({ vinCode, optionCode, key, mjsid }) =>
    await http.post('/ycyj/part/findPartByKey', {
      vinCode,
      key,
      secondQuery: true,
      includeParentChild: true,
      optionCode,
      mjsid,
    }),

  /**
   * 添加减损记录
   * @param {String} derogationAmount 减损金额
   * @param {String} vin VIN
   * @param {String} falseOe 错误的oe码
   * @param {String} trueOe 正确的oe码
   * @param {String} remarks 备注信息
   */
  addDerogation: async ({ derogationAmount, vin, falseOe, trueOe, remarks }) =>
    await http.post('product/ycyj/derogation/saveDerogationRecord', {
      derogationAmount,
      vin,
      falseOe,
      trueOe,
      remarks,
    }),

  /**
   * 获取配件图片
   * @param {String} imageName 图片名
   * @param {String} imagePrePath 图片前缀 对应VIN定型返回 prefix 字段
   */
  getPartImage: async ({ imageName, imagePrePath, firstLevelId, secondLevelId, source }, { cancelToken }) =>
    await http.post(
      '/service/common/part/reqPartImage/m2',
      {
        imageName,
        imagePrePath,
        firstLevelId,
        secondLevelId,
        source: source ? source : firstLevelId && secondLevelId ? '1' : '2',
      },
      {
        cancelToken,
      },
    ),

  /**
   * 获取图片中的所有配件
   * @param {String} vinCode VIN
   * @param {String} optionCode 当前车辆的 optionCode
   * @param {String} imageName 图片名
   */
  queryPartsByImage: async ({ vinCode, optionCode, mjsid, vehicle, image, source }, { cancelToken }) =>
    await http.post(
      '/ycyj/part/findPartByImage',
      {
        vinCode, // VIN码
        optionCode, // VIN查询返回
        mjsid, // MJSID
        brand: vehicle.brand, // 品牌
        subBrand: vehicle.subBrand, // 厂牌
        mjVehicleSys: vehicle.mjVehicleSys, // 车系
        mjVehicleGroup: vehicle.mjVehicleGroup, // 车组
        image, // 图片名称（非空）
        includeParentChild: true, // 传true
        source, // 0:oe, 1:结构树, 2: 其他
      },
      {
        cancelToken,
      },
    ),

  // /**
  //  * 查询配件结构树
  //  * @param {String} firstLevelId 一级 id
  //  * @param {String} secondLevelId 二级 id
  //  * @param {String} vin VIN
  //  * @param {String} optionCode 当前车辆的 optionCode
  //  */
  // getPartTreeByPage: async ({ firstLevelId, secondLevelId, vin, optionCode }) =>
  //   await http.post('service/common/part/getPartTreeByPage', {
  //     firstLevelId,
  //     secondLevelId,
  //     vin,
  //     optionCode,
  //   }),
};
