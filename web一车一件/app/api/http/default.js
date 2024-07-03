import axios from 'axios';
import { baseURL } from 'config';
import { appVersion } from '../../config/version';
import { common_params } from '../../config/constant';
import { getBrowserVersion } from '../../utils/browser';

axios.defaults.baseURL = baseURL;
axios.defaults.headers.common['Product-Code'] = common_params.PRODUCT_CODE;
axios.defaults.headers.common['Language'] = 'zh_CN';
axios.defaults.headers.common['Client-Info'] = getBrowserVersion();
axios.defaults.headers.common['Version'] = appVersion;
export default axios;
