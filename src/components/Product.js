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

var htmlArray = [];
var entryObj= {
  api1: 'api',
  api2: 'api1',
  api3: 'api3',
}
Object.keys(entryObj).forEach(function(element){
    htmlArray.push({
        _html:element,
        title:'',
        chunks:[element]
    })
})
var getHtmlConfig = function(name,chunks){
  return {
      template:`./src/pages/${name}.html`,
      filename:`pages/${name}.html`,
      inject:true,
      hash:false,
      chunks:[name]
  }
}
function HtmlWebpackPlugin(obj){
    this.obj = obj
}
const plugins = []
htmlArray.forEach(function(element){
  plugins.push(getHtmlConfig(element._html,element.chunks))
})
console.log(plugins)