// 初始值定义
let data = 'share.worker'

onconnect = function(e) {
    const port = e.ports[0];

    // 监听主线程的消息
    port.onmessage(function (event) {
       console.log(event.data) 
      // 工作线程向主线程发送消息
      port.postMessage(data);
    })
};




