import axios from 'axios';

const api = axios.create({
    baseURL: 'http://scvsistemas.ddns.net:8855/redmine'
})

export default api;

