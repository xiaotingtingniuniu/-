import http from './http';

export default {
  /**
   * 根据VIN+OE查询该配件替换链信息
   * @param {String} vinCode VIN
   * @param {String} optionCode VIN查询返回，与VIN码打包传输
   * @param {String} mjsid mjsid
   * @param {String} partNumber OE号
   * @param {String} brand 品牌
   * @param {String} subBrand 厂牌
   * @param {String} mjVehicleSys 车系
   * @param {String} mjVehicleGroup 车组
   */
  findSubstituteLink: async (vinCode, optionCode, mjsid, partNumber, brand, subBrand, mjVehicleSys, mjVehicleGroup) =>
    await http.post('/ycyj/part/findSubstituteLink', {
      vinCode,
      optionCode,
      mjsid,
      partNumber,
      brand,
      subBrand,
      mjVehicleSys,
      mjVehicleGroup,
    }),
};
