import { success, error } from 'utils/requestHandler'
// import map from 'utils/hashMap'
import fetch from 'utils/request'

const State = {
    detailData: []  
}


export default {
  namespace: 'parkExitDetail',
  state: {...State},
  subscriptions: {
    setup ({ dispatch, history }) {
    }
  },

  effects: {
    * getDetailData ({ payload }, { put, select }) {
        const obj = payload && JSON.parse(payload)
        
        const params = {
          traceId: obj.traceId,
          fromTime: Math.floor(obj.fromTime/1000),
          toTime: parseInt(obj.toTime/1000)
        }
      
        const detailData = yield fetch('park/log/get.do', 'GET', params).catch(error())
        if (!detailData) return 
  
        yield put({ type: 'updateState',
          payload: {
            detailData
          }
        })
      },
  },

  reducers: {
    // 浅复制 state
    updateState (state, { payload }) {
      return { ...state, ...payload }
    },
    clear (state, { payload }) {
      return { ...State, ...payload }
    }
  }
}
