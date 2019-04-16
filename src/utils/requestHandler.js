import { message } from 'antd'

message.config({
  top: 30,
  duration: 2,
  maxCount: 1
})

const error = (msg) => (err) => {
    let  errorMsg = '系统出错，请稍后重试！'
    if (err.status > 200 && err.status < 300) {
      errorMsg = err.errorMsg
    }
    message.error(msg || errorMsg)
    return false
}

const success = (msg) => (content) => {
  message.success(msg || '操作成功')
  return content
}

export {
  error,
  success
}
