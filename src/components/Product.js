/**
 * 基础组件
 * @class Product
 */

import React, { Component } from 'react'
import './product.less'

class Product extends Component {
    componentDidMount () {
        // function* a(){
        //     yield 1
        //     yield 2
        //     yield 3
        // }
        // console.log(a().next())
        // console.log(a().next())
        // console.log(a().next())
    }

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
