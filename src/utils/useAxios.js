import React, { useContext } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import dayjs from "dayjs";
import AuthContext from "../context/AuthContext";

export const useAxios = () => {
    const baseURL = "http://localhost:8000";
    const { authTokens, setUser, setAuthTokens } = useContext(AuthContext);

    const axiosInstance = axios.create({
        baseURL,
        headers: {
            Authorization: `Bearer ${authTokens?.access}`
        }
    });
    
    axiosInstance.interceptors.request.use(async req => {
        const user = jwtDecode(authTokens.access);
        const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
    
        if(!isExpired){
            return req;
        }
        const res = await axios.post(`${baseURL}/api/token/refresh/`, {
            refresh: authTokens.refresh
        });
        localStorage.setItem("authTokens" , JSON.stringify(res.data));
        setAuthTokens(prev => res.data);
        setUser(prev => jwtDecode(res.data.access));

        req.headers.Authorization = `Bearer ${res.data.access}`;
        return req;
    });
    

    return axiosInstance;
};
