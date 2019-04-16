import qs from 'qs'
const fetch = require('node-fetch');
const {isDev} = __config__
const { host } = window.location

function parseJSON (response) {
    return response.json()   
}

export default function request (url, method, body) {
    let devhost = 'https://mocks.alibaba-inc.com/mock/LogStatistics/'
    devhost = 'http://30.11.162.254:7031/'

    const onLineHost = '//' + host + '/'
    if (isDev) {
        url = devhost + url
    } else {
        url = onLineHost + url
    }

    const defaultOptions = {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    }

    let options = {}
    switch (method) {
       case 'GET': 
        options = defaultOptions
        url += '?' + qs.stringify(body)
       break;

       case 'DELETE': 
        options = defaultOptions
        url += '?' + qs.stringify(body)
       break;

       default: 
        options = {
            ...defaultOptions,
            body: JSON.stringify(body)
        }
   }
  
  return fetch(url, options)
    .then(parseJSON)
    .then((resp) => {
      if (resp && resp.code === 200) {
        return resp.data || {}
      } 

      throw resp
    }).catch(err => {
      throw err
    })
}