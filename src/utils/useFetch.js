import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import jwtDecode from "jwt-decode";
import dayjs from "dayjs";

export const useFetch = () => {
    const baseURL = "http://127.0.0.1:8000";
    const { user, setAuthTokens , setUser , authTokens } = useContext(AuthContext);
    const config = {}

    const refreshToken = async authTokens => {
        const res = await fetch(`${baseURL}/api/token/refresh/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ refresh: authTokens.refresh })
        });
        const data = await res.json();
        localStorage.setItem("authTokens", JSON.stringify(data));
        console.log("refreshed ->" , data);
        setAuthTokens(prev => data);
        setUser(prev => jwtDecode(data?.access));
        return data;
    };

    const originalRequest = async (url , config) => {
        const response = await fetch(`${baseURL}${url}` , config)  ;
        const data = await response.json();
        return {
            response,
            data
        }   
    }
    const callFetch = async url => {
        const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
        if (isExpired) {
            const newAuthTokens = await refreshToken(authTokens);
        }
        config.headers = {
            Authorization : `Bearer ${authTokens?.access}`
        }
        const {response , data} = await originalRequest(url , config);
        return { response ,data };

    };
    return callFetch;
}