
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Select } from 'antd'
import style from './index.css'
const Option = Select.Option

const MSelect = ({ options, onSearch, mode, ...other }) => {
  return (
    <Select
      allowClear
      className={style.choosePost}
      mode={mode}
      showSearch
      placeholder={'请选择'}
      optionFilterProp="children"
      onBlur={() => {
        // 多选
        if (onSearch && mode) {
          onSearch()
        }
        // 单选
        // if (onSearch && (!value || !options.length)) {
        //   onSearch()
        // }
      }}
      style={{ width: '100%' }}     
      getPopupContainer={() => document.getElementById('main_content')}
      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      {...other}
    >
       {(options || []).map(d => {
          return <Option key={d.id}>{d.name}</Option>
       })}
    </Select>
  )
}

export default connect()(MSelect)
