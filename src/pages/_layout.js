import React from 'react';
// import { connect } from 'dva';
// import style from './_layout.less';
import {BrowserRouter, Route, Switch, Redirect, HashRouter } from 'react-router-dom'
import {renderRoutes} from 'react-router-config';
import ParkExit from '../pages/LogMonitoring/ParkExit';
import ParkExitDetail from '../pages/LogMonitoring/ParkExitDetail';
import { Layout, PageHeader, Menu, Icon } from 'antd';
import { relativeTimeThreshold } from 'moment';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const routerMap = {
    '/': '日志监控视图', 
    '/ParkExit': '日志监控视图',
    '/ParkExit/:id/ParkExitDetail': '日志监控详情'
};

const nameSpace = 'common'

export default class Layout_ extends React.Component {
    rootSubmenuKeys = ['rule', 'config'];
    rootMenuKeys = ['DefaultList', 'ComponentManage', 'BPM', 'ApiGateway', 'ParkUse', 'DeviceManage', 'RuleTopo', 'ApiTypeManage', 'Redis'];
    state = {
        openKeys: ['rule'],
        collapsed: false
    }

    componentDidMount() {

    }


    // 菜单收缩展开
    updateState = (payload) => {
        const { dispatch } = this.props
        dispatch({ type: `${nameSpace}/updateState`, payload })
    }

    getPageHeader_title = () => {
        const { history } = this.props
        const path = history.location.pathname
        const pathLength = path.split('/').filter(i => i).length

        let title = null
        Object.entries(routerMap).map(([key,value]) =>{
            if (key === path) {
                title = value
            } 

            const _str =  key.split(':')[0]
            if (path.includes(_str)) {
                title = value
            }
        })
        
        const backIcon = pathLength > 1 ? <Icon type="arrow-left" />: false
        return {
            title,
            backIcon
        }
    }

    render() {
        const { match, location, common, history, children, route } = this.props     
        const {title, backIcon} = this.getPageHeader_title()

        return (
            <Layout>
                {/* 动态内容 */}
                <PageHeader backIcon={backIcon} onBack={() => history.go(-1)} title={title} />
                <Content className='layout_content'>
                    {renderRoutes(route.routes)}                 
                </Content>
            </Layout>
        );
    }
}

