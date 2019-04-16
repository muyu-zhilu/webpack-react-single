/**
 * 基础组件
 * @class Product
 */

import React, { Component } from 'react'
import './parkExitDetail.less'
import moment from 'moment'
import { connect } from 'dva'
import { Steps, Skeleton, Card } from 'antd';

const Step = Steps.Step;

const nameSpace = 'parkExitDetail'
@connect(({ parkExitDetail, loading }) => ({
  parkExitDetail, 
  loading
}))
export default class Product extends Component {

    state = {
        data: {}
    }

    componentDidMount() {
        const {match} = this.props
        const obj = match.params.obj
        const { dispatch } = this.props
        dispatch({ type: `${nameSpace}/getDetailData`, payload: obj}) 
    }

    componentWillUnmount() {
        const {dispatch} = this.props
        dispatch({ type: `${nameSpace}/clear`}) 
    }

    render() {
        const {parkExitDetail, loading} = this.props
        const {detailData: data} = parkExitDetail
      
        const stepDesc = (time) => time ? moment(time).format('YYYY-MM-DD hh:mm:ss.SSS') : ''
       
        const datav = Object.values(data).filter(el=>el)
        const current = datav.length - 1
       
        const getLoading = loading.effects[`${nameSpace}/getDetailData`]

        return (
            <div className='park-exit-detail content'>
                <Card title={`消息上行`} bordered={false}>
                    <Skeleton loading={getLoading}  active>                     
                        <Steps progressDot current={current}>
                            <Step title="Connector" description={stepDesc(data.connectorActionTime)} />
                            <Step title="Edge" description={stepDesc(data.edgeActionTime)} />
                            <Step title="领域" description={stepDesc(data.domainActionTime)} />
                            <Step title="应用" description={stepDesc(data.appActionTime)} />
                        </Steps>                  
                    </Skeleton>
                </Card>

                <Card title={`指令下行`} bordered={false} style={{marginTop: 24}}>
                    <Skeleton loading={getLoading} active> 
                        <Steps progressDot current={current-3}>
                            <Step title="应用" description={stepDesc(data.appEndTime)} />
                            <Step title="领域" description={stepDesc(data.domainEndTime)} />
                            <Step title="Edge" description={stepDesc(data.edgeEndTime)} />
                            <Step title="Connector" description={stepDesc(data.connectorEndTime)} />
                        </Steps>               
                    </Skeleton>
                </Card>
               
            </div>
        )
    }
}
