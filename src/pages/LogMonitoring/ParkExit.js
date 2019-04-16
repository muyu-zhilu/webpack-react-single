/**
 * 基础组件
 * @class Product
 */

import React, { Component } from 'react'
import './parkExit.less'
import BarGraph from 'components/basicComp/BarGraph'
import { connect } from 'dva'
import moment from 'moment'
import { Form, Switch, Card, DatePicker, Button, Spin, Input } from 'antd';

const { RangePicker } = DatePicker;

const ExtraRender = ({ onSearch, searchOptions, onChange }) => {
    const { carNumber, timeSlot } = searchOptions

    return (
        <div>
            <Form layout="inline">
                <Form.Item label='车牌'>
                    <Input
                        value={carNumber}
                        placeholder='请输入'
                        onChange={onChange('carNumber', true)}
                        onPressEnter={onSearch}
                    />
                </Form.Item>

                <Form.Item label='时间段'>
                    <RangePicker
                        value={timeSlot}
                        showTime={{ format: 'HH:mm' }}
                        format="YYYY-MM-DD HH:mm"
                        placeholder={['开始日期', '结束日期']}
                        onChange={onChange('timeSlot')}
                    />
                </Form.Item>

                <Form.Item>
                    <Button type='primary' style={{ marginRight: 16 }} onClick={onSearch}>搜索</Button>
                </Form.Item>
            </Form>
        </div>
    )
}

const nameSpace = 'parkExit'
@connect(({ parkExit, loading }) => ({
    parkExit,
    loading
}))
export default class ParkExit extends Component {

    constructor(props) {
        super(props)
        this.timer = null

        this.state = {
            viewData: []
        }
    }

    updateState = (payload) => {
        const { dispatch } = this.props
        dispatch({ type: `${nameSpace}/updateState`, payload })
    }

    componentDidMount() {
        const { dispatch, history, parkExit } = this.props
        const { viewData } = parkExit
        if (history.action !== 'POP' || !viewData.length) {
            this.didMountEvenet()
        }       
    }

    didMountEvenet = () => {
        const { dispatch } = this.props
        dispatch({ type: `${nameSpace}/clear`}) 
        dispatch({ type: `${nameSpace}/getViewData` })
    }

    componentWillUnmount() {
        this.updateState({isRealTime: false})
        clearInterval(this.timer)
    }

    setRealTime = () => {
        const { dispatch, parkExit } = this.props
        const { isRealTime } = parkExit
        this.updateState({ isRealTime: !isRealTime })

        if (isRealTime) {
            clearInterval(this.timer)
        } else {
            this.timer = setInterval(() => {
                this.updateState({searchOptions: {
                    timeSlot: [ 
                        moment().subtract(5, "minutes"),
                        moment()
                    ]
                }})
                dispatch({ type: `${nameSpace}/getViewData` })
            }, 5000);
        }
    }

    onChange = (key, isTarget) => (v) => {
        const { dispatch, parkExit } = this.props
        const { searchOptions } = parkExit

        this.updateState({
            searchOptions: {
                ...searchOptions,
                [key]: isTarget ? v.target.value : v
            }
        })
    }

    onSearch = () => {
        // 清除实时监控
        clearInterval(this.timer)
        this.updateState({ isRealTime: false })

        const { dispatch } = this.props
        dispatch({ type: `${nameSpace}/getViewData` })
    }

    clickChart = (e) => {
        const { history } = this.props
        const id = e.target._id || ''
        for (let item of this.fields) {
            if (id.includes(item)) {
                const fromTime = Number(item.split('/')[0])
                const toTime = fromTime + 300000
                const items = item.split('/')
                const traceId = items[items.length - 1]
                const obj = {
                    fromTime,
                    toTime,
                    traceId
                }
                history.push(`/ParkExit/${JSON.stringify(obj)}/ParkExitDetail`)
            }
        }
    }

    dataFormat = (result) => {
        const names = ['应用', '领域', 'Edge', 'Connector', '数据异常']
        const data = []

        if (!result.length) return []

        for (let name of names) {
            let map = { name }
            for (let item of result) {
                const extra = `/${item.isQuery}/${item.traceId}`
                map.name === 'Connector' && (map[item.actionTime + extra] = item.connectorTime)
                map.name === 'Edge' && (map[item.actionTime + extra] = item.edgeTime)
                map.name === '领域' && (map[item.actionTime + extra] = item.domainTime)
                map.name === '应用' && (map[item.actionTime + extra] = item.appTime)

                if (!item.countTime) {
                    map.name === '数据异常' && (map[item.actionTime + extra] = 404)
                }
            }

            data.push(map)
        }

        const dataKeys = data[0] || []
        this.fields = Object.keys(dataKeys).filter(el => el !== 'name')

        return data
    }

    render() {
        const { parkExit, loading } = this.props
        const { viewData, isRealTime, searchOptions } = parkExit
        const getLoading = !isRealTime && loading.effects[`${nameSpace}/getViewData`]

        const data = this.dataFormat(viewData)
   
        const cols = {
            xAxis: {
                alias: '出场开始时间',
                formatter: val => {
                    if (typeof val === 'string') {
                        val = val.split('/')[0]
                    }
                    val = moment(Number(val)).format('h:mm:ss')
                    return val
                }
            },
            yAxis: {
                alias: '运行时间/ms'
            }
        };

        const tooltip = ['xAxis*yAxis*name', (x, y, name) => {
            let time = x.split('/')[0]
            time = moment(Number(time)).format('h:mm:ss.SSS')

            const carNumber = x.split('-')[2]

            const title = time + ' / ' + carNumber

            return {
                //自定义 tooltip 上显示的 title 显示内容等。
                name: name,
                title: title,
                value: y || 0
            };
        }]

        return (
            <div className='parking-log-monitor content'>
                <Card
                    title={<div>
                        <Form layout="inline">
                            <Form.Item style={{ paddingRight: '35%' }}>
                                停车出口
                            </Form.Item>
                            <Form.Item label='实时监控'>
                                <Switch checked={isRealTime} onChange={this.setRealTime} />
                            </Form.Item>
                        </Form>
                    </div>}
                    bordered={false}
                    extra={<ExtraRender
                        onSearch={this.onSearch}
                        searchOptions={searchOptions}
                        onChange={this.onChange}
                    />}
                >
                    <Spin tip="Loading..." spinning={getLoading}>
                        <BarGraph
                            data={data}
                            x_fields={this.fields}
                            color={'name'}
                            scale={cols}
                            clickChart={this.clickChart}
                            tooltip={tooltip}
                        />
                    </Spin>
                </Card>
            </div>
        )
    }
}

