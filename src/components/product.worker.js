// 初始值定义
const data = '我是web Worker'

// 监听主线程的消息
onmessage = function(event){
   console.log(event.data)

    // 工作线程向主线程发送消息
    postMessage(data);
};





