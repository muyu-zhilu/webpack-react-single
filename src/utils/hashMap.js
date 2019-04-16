/*
 * @Author: muyu zhao
 * @Date: 2018-06-22 16:48:06
 * @Last Modified by: barry sun
 * @Last Modified time: 2018-07-02 15:37:13
 */

const Map = (result) => (hashMap) => {
    if (!result) return []
    // 最终返回的完整数据
    let newResult
    if (result instanceof Array) {
      newResult = []
      if (!hashMap) hashMap = []
      for (let i of result) { // 遍历外层
        newResult.push(mapping(i)(hashMap[0]))
      }
    } else {
      newResult = {}
      if (!hashMap) hashMap = {}
      newResult = mapping(result)(hashMap)
    }
    return newResult
  }
  
  const mapping = (hash = {}) => (map = {}) => {
    if (!hash) return []
    const newMap = {}
    for (let i of Object.keys(hash)) {
      if (map[i]) {
        if (typeof map[i] === 'object') {
          newMap[i] = Map(hash[i])(map[i])
        } else if (typeof map[i] === 'function') {
          newMap[i] = hash[map[i]()]
        } else {
          newMap[map[i]] = hash[i]
        }
      } else {
        newMap[i] = hash[i]
      }
    }
    return newMap
  }
  
  export default Map