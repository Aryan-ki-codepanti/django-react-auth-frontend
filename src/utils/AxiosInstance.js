import axios from "axios";
import jwtDecode from "jwt-decode";
import dayjs from "dayjs";

const baseURL = "http://localhost:8000";
let authTokens = localStorage.getItem("authTokens")
    ? JSON.parse(localStorage.getItem("authTokens"))
    : null;

export const axiosInstance = axios.create({
    baseURL,
    headers: {
        Authorization: `Bearer ${authTokens?.access}`
    }
});

axiosInstance.interceptors.request.use(async req => {
    if (!authTokens){
        authTokens = localStorage.getItem("authTokens")
            ? JSON.parse(localStorage.getItem("authTokens"))
            : null;
        req.headers.Authorization = `Bearer ${authTokens?.access}`;
    }
    const user = jwtDecode(authTokens.access);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

    if(!isExpired){
        return req;
    }
    const res = await axios.post(`${baseURL}/api/token/refresh/`, {
        refresh: authTokens.refresh
    });
    localStorage.setItem("authTokens" , JSON.stringify(res.data));
    req.headers.Authorization = `Bearer ${res.data.access}`;
    return req;
});
