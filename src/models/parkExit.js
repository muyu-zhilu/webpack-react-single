import { success, error } from 'utils/requestHandler'
// import map from 'utils/hashMap'
import fetch from 'utils/request'
import moment from 'moment'

const State = {
    viewData: [],
    detailData: [],
    searchOptions: {
        timeSlot: [ 
            moment().subtract(5, "minutes"),
            moment()
        ]
    }   
}


export default {
  namespace: 'parkExit',
  state: {...State},
  subscriptions: {
    setup ({ dispatch, history }) {
    }
  },

  effects: {
    * getViewData ({ payload }, { put, select }) {  
        const {searchOptions} = yield select(({ parkExit }) => parkExit)     
        const {carNumber, timeSlot} = searchOptions    
        const [fromTime, toTime] = timeSlot
              
        const params = {
            plateNumber: carNumber,
            fromTime: Math.floor(fromTime.valueOf()/1000),
            toTime: parseInt(toTime.valueOf()/1000)
        }

        const viewData = yield fetch('park/log/query.do', 'GET', params).catch(error())
        if (!viewData) return 

        yield put({ type: 'updateState',
            payload: {
                viewData
            }
        })
    },

    * getDetailData ({ payload }, { put, select }) {

        const params = payload && JSON.parse(payload)
  
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
