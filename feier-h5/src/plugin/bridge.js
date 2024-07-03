/* eslint-disable no-undef */
function setupWebViewJavascriptBridge(callback) {
  //Android使用
  if (window.WebViewJavascriptBridge) {
    callback(WebViewJavascriptBridge);
  } else {
    document.addEventListener(
      "WebViewJavascriptBridgeReady",
      function() {
        callback(WebViewJavascriptBridge);
      },
      false
    );
  }

  // ios使用
  if (window.WebViewJavascriptBridge) {
    return callback(window.WebViewJavascriptBridge);
  }
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback);
  }
  window.WVJBCallbacks = [callback];
  var WVJBIframe = document.createElement("iframe");
  WVJBIframe.style.display = "none";
  WVJBIframe.src = "https://__bridge_loaded__";
  document.documentElement.appendChild(WVJBIframe);
  setTimeout(
    (function() {
      document.documentElement.removeChild(WVJBIframe);
    },
    0)
  );
}

export default {
  callhandler(name, data, callback) {
    console.log("name", name);
    console.log("data", data);
    console.log("callback", callback);
    setupWebViewJavascriptBridge(function(bridge) {
      //JS调用Objc的方法
      bridge.callHandler(name, data, callback);
    });
  },
  registerhandler(name, callback) {
    setupWebViewJavascriptBridge(function(bridge) {
      //JS注册方法给Objc调用
      bridge.registerHandler(name, function(data, responseCallback) {
        callback(data, responseCallback);
      });
    });
  }
};
