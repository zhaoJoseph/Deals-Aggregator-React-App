import axios from 'axios';
import { ENDPOINTS } from './endpoints';

const getPost = async (pageNum) => {
    const res = await axios.get(`${ENDPOINTS.POST_URL}?pageNum=${pageNum}`)
    return res.data;
}

const getTotal = async () => {
    const res = await axios.get(`${ENDPOINTS.POST_TOTAL}`)
    return res.data;
}

const searchPosts = async (list, urls, pageNum) => {
    const res = await axios.get(`${ENDPOINTS.POST_SEARCH}?searchParams=${list}&urlParams=${urls}&pageNum=${pageNum}`)
    return res.data;
}

const getBuild = async () => {
    const res = await axios.get(`${ENDPOINTS.GET_TIME}`)
    return res.data;
}

const postServices = {
    getPost,
    getTotal,
    searchPosts,
    getBuild
}

export default postServices;