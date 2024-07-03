const getParams = name => {
    const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    const r = window.location.search.substr(1).match(reg); // search,查询？后面的参数，并匹配正则
    if (r !== null) {
      return unescape(r[2]);
    }
    return null;
};
export default getParams;