import React, { Component } from 'react'
import styles from './index.less'
import { connect } from 'dva'
import { Tabs } from 'antd';
import { WhiteList, DeviceMapping, DuplicateRemoval, EnvironmentalSensing, Rules, Apis, ContrastDevices } from './components';
const {Provider, Consumer} = React.createContext();
const TabPane = Tabs.TabPane;

const nameSpace = 'redis'
@connect(({ redis, common, loading }) => ({
  redis, 
  common, 
  loading
}))
export default class LogMonitoring extends Component {
  constructor(props) {
    super(props);
  }

  state = { 
    visible: false,
    data: 1
  }

  // reducer封装函数
  updateState ( payload) {
    const { dispatch } = this.props
    dispatch({ type: `${nameSpace}/updateState`, payload})
  }

  componentDidMount () {
    const { dispatch } = this.props
    // dispatch({ type: `${nameSpace}/getList`})
  }

  render () {
    const { history } = this.props
    const {data} = this.state

    return (
      <div className={styles.content}>       
        <Tabs
          defaultActiveKey="1"
        >
          <TabPane tab="白名单" key="1">
            <WhiteList Consumer={Consumer}/>
          </TabPane>
          <TabPane tab="物理设备逻辑设备映射表" key="2">
            <DeviceMapping Consumer={Consumer}/>
          </TabPane>
          <TabPane tab="高清车检或闸机去重数据" key="3">
            <DuplicateRemoval/>
          </TabPane>
          <TabPane tab="环感运行数据" key="4">
            <EnvironmentalSensing/>
          </TabPane>
          <TabPane tab="运行规则" key="5">
            <Rules history={history}/>
          </TabPane>
          <TabPane tab="运行api" key="6">
            <Apis/>
          </TabPane>
          <TabPane tab="对比设备" key="7">
            <ContrastDevices/>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}




