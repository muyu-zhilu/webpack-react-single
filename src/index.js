import dva from 'dva';
import './index.less'
// import '@babel/polyfill';
import createLoading from 'dva-loading'
const history = require('history');

// 1. Initialize
const app = dva({
//   history: history.createBrowserHistory()
//   history: history.createHashHistory()
});
// 2. Plugins
app.use(createLoading());

// 3. Model
require('./models').default.map(app.model)

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');