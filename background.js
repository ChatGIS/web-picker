// 创建菜单
chrome.contextMenus.create({
    id: "selectword-save",
    title: "划词保存",
    contexts: ["selection"]
}, () => {
    console.log('contextMenus are create.');
})

chrome.contextMenus.create({
    id: "clearBadge",
    title: "清除徽章",
    contexts: ["page"]
}, () => {
    console.log('contextMenus are create.');
})


// 右键菜单点击监听事件
chrome.contextMenus.onClicked.addListener((info) => {
    if(info.menuItemId == "clearBadge"){
        setBadgeTextAndColor("","#000000");
        return
    }
    fetch("http://101.42.170.51:3007/api/english", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `name=${info.selectionText}`
    }).then(response => {
        return response.json();
    }).then(data => {
        if(data.meta.status == "201"){
            setBadgeTextAndColor("Ok", "green");
        } else if(data.meta.status == "422"){
            setBadgeTextAndColor("Have", "#FFCC00");
        } else {
            setBadgeTextAndColor("Err", "red");
        }
        
        // 报错信息：Refused to evaluate a string as JavaScript because 'unsafe-eval' is not an allowed source of script in the following Content Security Policy directive: "script-src 'self'".
        // setTimeout(setBadgeTextAndColor("","#000000"), 10000)
    })
})

// 设置徽章的文本及颜色
function setBadgeTextAndColor(text, color){
    chrome.action.setBadgeText(
        {text: text},  // Also, also green
        () => {},
    )

    if(color){
        chrome.action.setBadgeBackgroundColor(
            {color: color},  // Also, also green
            () => {}
        )
    }
}

// background.js

// 当插件安装时触发
chrome.runtime.onInstalled.addListener(function() {
    console.log("Extension installed");
  });
  
  // 处理跨域请求的函数
  function makeCorsRequest(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          // 请求成功，执行回调
          callback(null, xhr.responseText);
        } else {
          // 请求失败，执行回调并传递错误信息
          callback(new Error("Request failed"));
        }
      }
    };
    xhr.open("GET", url, true);
    xhr.send();
  }
  
  // 示例：监听来自内容脚本的消息
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.action === "makeCorsRequest") {
        // 调用跨域请求函数
        makeCorsRequest(request.url, function(error, response) {
          if (error) {
            // 处理错误
            console.error(error.message);
          } else {
            // 将响应发送回内容脚本
            sendResponse(response);
          }
        });
      }
    }
  );

  // background.js

function makeCorsPostRequest(url, data, callback) {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(data),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Request failed');
      }
      return response.text();
    })
    .then(responseText => {
      callback(null, responseText);
    })
    .catch(error => {
      callback(error);
    });
  }
  
  // 示例：监听来自内容脚本的消息
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.action === "makeCorsPostRequest") {
        makeCorsPostRequest(request.url, request.data, function(error, response) {
          if (error) {
            console.error(error.message);
          } else {
            sendResponse(response);
          }
        });
        // 必须返回true，以确保sendResponse在异步请求完成后仍然有效
        return true;
      }
    }
  );
  
  
  
  