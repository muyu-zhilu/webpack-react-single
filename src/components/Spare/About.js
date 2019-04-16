/**
 * 基础组件
 * @class Product
 */

import React, { Component } from 'react'
import './product.less'
import workerJs from './product.worker.js'
console.log(111, workerJs)
 // 创建 worker 实例
 var worker =  new SharedWorker('./product.worker.js');

class About extends Component {

    state  = {
        num: 0,
        data:{
            name: '小米',
            age: 18,
            工作: '教师'
        }
    }

    componentDidMount () {
        // this.webWorker()
    }

    webWorker = () => {         
        worker = new SharedWorker('./product.worker.js');

        const data = this.state.data
        
        // 必须手动开启
        worker.port.start();

        // 主线程向工作线程发送消息
        worker.port.postMessage(data);
        
        // 监听工作线程的消息
        worker.port.onmessage = (e) =>{
            console.log(e.data); 
        }
        
    }

    stopWorker () {
        worker.terminate();
    }

    render() {
        return (
            <div>
                <div>我是About页面的组件。</div>
                <button onClick={this.webWorker}> 开始webWorker </button> &nbsp;
                <button onClick={this.stopWorker}> 结束webWorker </button>
                <div ref={node => this.timeCount = node} className='timeCount'>{this.state.timeCount || 0}</div>
            </div>
        )
    } 
}

export default About
