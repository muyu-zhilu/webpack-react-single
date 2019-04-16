import React from 'react';
import {BrowserRouter,Route,Switch,Redirect,HashRouter } from 'react-router-dom'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import {LocaleProvider} from 'antd'
import {renderRoutes} from 'react-router-config';
import Layout from './pages/_layout.js';
import ParkExit from './pages/LogMonitoring/ParkExit';
import ParkExitDetail from './pages/LogMonitoring/ParkExitDetail';

const routes = [
    {
        // path: '/',
        // exact: true,
        component: Layout,
        routes: [
            { path: "/", exact: true, component: ParkExit },
            {
                path: '/ParkExit',
                exact: true,
                component: ParkExit
            },
            {
                path: '/ParkExit/:obj/ParkExitDetail',
                component: ParkExitDetail
            }
        ]
    }
];

const AppRouter = () => {

    return (
        <LocaleProvider locale={zhCN}>
            <HashRouter>
                {renderRoutes(routes)}
            </HashRouter>
        </LocaleProvider>
    )
}

export default AppRouter

