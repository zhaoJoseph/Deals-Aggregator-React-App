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

const searchPosts = async (list, pageNum) => {
    const res = await axios.get(`${ENDPOINTS.POST_SEARCH}?searchParams=${list}&pageNum=${pageNum}`)
    return res.data;
}

const postServices = {
    getPost,
    getTotal,
    searchPosts
}

export default postServices;