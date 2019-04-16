/**
 * 基础组件
 * @class Product
 */

import React, { Component } from 'react'
import './product.less'
import Worker from './product.worker.js'

 // 创建 worker 实例
let worker = null;

class Product extends Component {

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
        worker = new Worker();

        const data = this.state.data
        
        // 主线程向工作线程发送消息
        worker.postMessage(data);

        // 监听工作线程的消息
        worker.onmessage = (event) => {
            this.timeCount.innerHTML = event.data;                 
        };
        
    }

    stopWorker () {
        worker.terminate();
    }

    render() {
        return (
            <div>
                <div>我是Product页面的组件。</div>
                <button onClick={this.webWorker}> 开始webWorker </button> &nbsp;
                <button onClick={this.stopWorker}> 结束webWorker </button>
                <div ref={node => this.timeCount = node} className='timeCount'>{this.state.timeCount || 0}</div>
            </div>
        )
    } 
}

export default Product

