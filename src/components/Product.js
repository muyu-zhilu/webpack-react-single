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
                我是基础组件哦。
                <div className='yes'>啧啧啧</div>
            </div>
        )
    } 
}

export default Product