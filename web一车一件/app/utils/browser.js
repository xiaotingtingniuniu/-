const getBrowserVersion = () => {
  const ff = getFireFoxVersion();
  const chrome = getChromeVersion();
  const safari = getSafariVersion();
  const ie = getIEVersion();

  if (~ff) {
    return `FireFox ${ff}`;
  } else if (~chrome) {
    return `Chrome ${chrome}`;
  } else if (~safari) {
    return `Safari ${safari}`;
  } else if (~ie) {
    return `IE(Edge) ${ie}`;
  } else {
    return navigator.userAgent;
  }
};

const notSupportCopyBtn = () => {
  const chromeVersion = getChromeVersion();
  const ieVersion = getIEVersion();

  return (chromeVersion !== -1 && chromeVersion < 40) || (ieVersion !== -1 && ieVersion < 10);
};

const getFireFoxVersion = () => {
  const res = navigator.userAgent.match(/Firefox\/(.*)/g);
  if (res && res.length) {
    const ffVersion = res[0].split('/')[1].split('.')[0];
    return +ffVersion;
  }
  return -1;
};

const getChromeVersion = () => {
  const res = navigator.appVersion.match(/Chrome\/(.*) /g);
  if (res && res.length) {
    const chromeVersion = res[0].split('/')[1].split('.')[0];
    return +chromeVersion;
  }
  return -1;
};

const getSafariVersion = () => {
  const res = navigator.appVersion.match(/Version\/(.*) /g);
  if (res && res.length) {
    const safariVersion = res[0].split('/')[1];
    return +safariVersion;
  }
  return -1;
};

const getIEVersion = () => {
  const userAgent = navigator.userAgent;
  const isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1;
  const isEdge = userAgent.indexOf('Edge') > -1 && !isIE;
  const isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
  if (isIE) {
    const reIE = new RegExp('MSIE (\\d+\\.\\d+);');
    reIE.test(userAgent);
    const fIEVersion = parseFloat(RegExp['$1']);
    if (fIEVersion >= 7 && fIEVersion <= 10) {
      return +fIEVersion;
    } else {
      return 6;
    }
  } else if (isEdge) {
    return 12;
  } else if (isIE11) {
    return 11;
  } else {
    return -1;
  }
};

export { getBrowserVersion, notSupportCopyBtn, getChromeVersion, getFireFoxVersion, getIEVersion, getSafariVersion };
