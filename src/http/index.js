import axios from "axios";
// import qs from "qs";
import {
    message
} from 'ant-design-vue';
import qs from 'qs'
const HttpRequest = axios.create({
    //  baseURL: "",
    timeout: 5000, // 请求超时时间
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
})

// HttpRequest.interceptors.request.use(config => {
//     return config
// }, error => {
//     Promise.reject(error)  
// })
axios.interceptors.response.use(
    response => {

        /**
         * code:200,接口正常返回;
         */
        const res = response.data
        if (res.code !== 0) {
            message.warning(res.msg || '系统异常', 2);
            return Promise.reject('error')
        } else {
            return response.data
        }
        // return response.data
    },
    error => {
        message.warning('系统异常', 2);
        return Promise.reject(error)
    }
)

HttpRequest.postBody = (url, data, config) => {
    if (!data) data = {};
    if (!config) config = {};
    Object.assign(config, { headers: { 'content-type': 'application/json' } });
    return axios.post(url, data, config)
};

// GET
HttpRequest.get = (url, data, config) => {
    if (!data) data = {};
    if (!config) config = {};
    Object.assign(config, { headers: { 'content-type': 'application/json' } });
    let str = qs.stringify(data)
    if (Object.keys(data).length > 0) {
        url = url.indexOf('?') == -1 ? url + '?' + str : url + '&' + str
    }
    return axios.get(url, {}, config)
};

HttpRequest.postForm = (url, data, config) => {
    let formData = data;
    if (!(data instanceof FormData)) {
        formData = new FormData();
        //添加其余参数
        for (let item in data) {
            let value = data[item];
            if (value !== null && value !== undefined)
                formData.append(item, value);
        }
    }
    return axios.post(url, formData, config)
};

export default HttpRequest;