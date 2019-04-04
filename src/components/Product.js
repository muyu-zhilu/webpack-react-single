/**
 * 基础组件
 * @class Product
 */

import React, { Component } from 'react'
import './product.less'

class Product extends Component {

    render() {
        return (
            <div>
                我是index页面的组件。
                <div className='yes'>哈哈</div>
            </div>
        )
    } 
}

export default Product
