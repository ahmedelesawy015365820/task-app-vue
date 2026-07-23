import axios from "axios";

const axiosSetting = axios.create({
    baseURL: `http://localhost:3000/`
});

axiosSetting.interceptors.request.use(
    function (config) {
        config.headers['lang'] = 'ar';
        config.headers['Accept-Language'] = 'ar';
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);
axiosSetting.defaults.headers.common['Accept'] = 'application/json';
axiosSetting.defaults.headers.common['lang'] = 'ar';
axiosSetting.defaults.headers.common['Accept-Language'] = 'ar';

axiosSetting.interceptors.response.use(function (response) {
    return response;
}, function (error) {
});
// end axios
export default axiosSetting;
