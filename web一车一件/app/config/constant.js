export const appVersion = '4.5.1';

/** sessionStorage 的项目名 */
export const session_types = Object.freeze({
  /** OE 反查页搜索的 OE */
  OE: 'oe',

  /** OE 搜索结果页的配件列表 */
  OE_PART_LIST: 'oePartList',

  /** OE 搜索结果页选择的配件列表 */
  OE_ACCURATE_PART: 'oeAccuratePart',

  /** 车型选择页中选择的厂牌 */
  OE_SELECTED_SUB_BRAND: 'oeSelectedSubBrand',

  /** 配件列表的提示信息 */
  OE_PART_LIST_MSG: 'oePartListMsg',

  /** 查询状态 */
  SEARCH_STATE: 'searchState',

  /** 选择的关键字 */
  SELECT_KEYWORD: 'selectKeyword',

  /** 输入的关键字 */
  INPUT_KEYWORD: 'inputKeyword',

  /** 当前车架信息 */
  CURRENT_VEHICLE: 'currentVehicle',

  /** 配件列表的提示信息 */
  PART_LIST_TOAST_MESSAGE: 'partListToastMessage',

  /** 查询得到的配件列表 */
  VIN_PART_LIST: 'vinPartList',

  /** 结构树 */
  TREE_PART_LIST: 'treePartList',

  /** 结构树中选择的一级菜单 */
  TREE_SELECTED_PART: 'treeSelectedPart',

  /** 结构树中选择的二级菜单 */
  TREE_SELECTED_SUB_PART: 'treeSelectedSubPart',

  /** 结构树中选择的图片 */
  TREE_SELECTED_IMG: 'treeSelectedImg',

  PROVINCE_CITY: 'provinceCity',

  /** 当前替换链信息 */
  SUBSTITUTE: 'substitute',

  /** 配件详情页面上一个页面 */
  PART_DETAILS_FROM: 'partDetailsFrom',

  /** 配件详情页面中需要标记的配件号 */
  PART_DETAILS_OE: 'partDetailsOE',

  /** 配件详情页面中需要标记的图中编号 */
  PART_DETAILS_REF: 'partDetailsRef',

  /** 配件详情页面的标题 */
  PART_DETAILS_TITLE: 'partDetailsTitle',

  /** 配件详情页面图片前缀 */
  PART_DETAILS_PREFIX: 'partDetailsPrefix',

  /** 配件详情页面图片名 */
  PART_DETAILS_IMG_NAME: 'partDetailsImgName',

  /** 配件详情页面图片名列表*/
  PART_DETAILS_IMG_NAME_LIST: 'partDetailsImgNameList',

  /** 配件详情页面的车型信息（品牌、厂牌、车组） */
  PART_DETAILS_VEHICLE: 'partDetailsVehicle',
});

export const session_excludes = [session_types.SUBSTITUTE];

/** localStorage 的项目名 */
export const local_types = Object.freeze({
  /** 搜索历史 */
  SEARCH_HISTORY: 'search_history',

  /** 是否已经显示过新功能引导 */
  TOTURIAL: 'mj_toturial',

  /** 常用配件列表的 展开/收起 状态， */
  EXPAND_COMMON_PARTS: 'expandCommonParts',
});

/** 路由名 */
export const router_names = Object.freeze({
  /** 首页 */
  HOME: 'home',

  /** 用户中心 */
  USER: 'user',

  /** VIN 查询结果页 */
  VIN: 'vin',

  /** VIN 查询结果页 */
  PART_TREE: 'part-tree',

  /** 配件详情展示页 */
  PART_DETAILS: 'part-details',

  /** OE 查询结果页 */
  OE: 'oe',

  /** OE 查询结果页 */
  VEHICLE_GROUP: 'vehicle-group',

  /** 由 OE 反查进入的配件详情展示页 */
  OE_PART_DETAILS: 'oe-part-details',

  /** 替换链信息u页 */
  SUBSTITUTE: 'substitute',

  /** 配件列表页 */
  PARTSLIST: 'parts-list',

  /** 付费升级页 */
  PAY: 'pay',

  /** 历史清单 */
  HISTORYLIST: 'history-list',

  /** 分享历史清单详情页 */
  SHAREHISTORYLIST: 'share-history-list',

  /** 未报价H5 */
  NOQUOTED: 'no_quoted',

  /** 报价H5 */
  QUOTED: 'quoted',

  /** 去报价H5 */
  GOQUOTED: 'goquoted',

  /** 个人信息H5 */
  PERSONALINFOR: 'personal',

  /** 微信页面H5 */
  WECHAT: 'wechat',
});

/** 中台响应码 */
export const response_code = Object.freeze({
  /** 请求成功 */
  SUCCESS: '0000',

  /** 过期 */
  EXPIRED: '9002',

  /** 验证码不正确 */
  VERIFY_CODE_INCORRECT: '9006',

  /** 在其他设备登陆 */
  LOGIN_ON_OTHER_DEVICES: '9014',

  /** 进入 SID 流程 */
  VIN_QUERY_FAILED: '2999',

  /** 用户已存在(注册时) */
  USER_ALREADY_EXISTS: '2701',
});

/** 积分类型 */
export const point_types = Object.freeze({
  LOGIN: '登陆',
  VIN: 'vin查询',
  OE: 'oe查询',
  KEY: '江湖名查询',
  USER_INFO: '完善个人信息',
});

export const common_params = Object.freeze({
  PRODUCT_CODE: 'W0201',
});

export const vehicle_keys = Object.freeze({
  BRAND: 'brand',
  SUB_BRAND: 'subBrand',
  SERIES: 'mjVehicleSys',
  GROUP: 'mjVehicleGroup',
  YEAR: 'year',
  ENGINE_DISPLACEMENT: 'engineDisplacement',
  TRANSMISSION: 'transmission',
});
