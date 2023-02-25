import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api'
});

axiosInstance.interceptors.request.use((config) => {
    config.headers.Authorization = window.localStorage.getItem('token');

    return config;
})

export default axiosInstance;
