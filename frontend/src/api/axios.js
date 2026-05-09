import axios from 'axios'
import { message } from 'ant-design-vue'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 5000
})

service.interceptors.request.use(
  config => {
    // do something before request is sent
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    console.error('err' + error)
    message.error(error.message || 'Request Error')
    return Promise.reject(error)
  }
)

export default service
