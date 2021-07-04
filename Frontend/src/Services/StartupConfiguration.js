import axios from 'axios';

export default function config() {
    // Add a request interceptor
    axios.interceptors.request.use(function (config) {
        const token = JSON.parse(window.localStorage.getItem("token"));
        if (token)
            config.headers.Authorization = "Bearer " + token;
        return config;
    });
}