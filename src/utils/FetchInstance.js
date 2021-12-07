import jwtDecode from "jwt-decode";
import dayjs from "dayjs";

const baseURL = "http://127.0.0.1:8000";

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

export const customFetcher = async (url , config={}) => {
    let authTokens = localStorage.getItem("authTokens")
        ? JSON.parse(localStorage.getItem("authTokens"))
        : null;

    const user = jwtDecode(authTokens.access);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

    if (isExpired) {
        authTokens = await refreshToken(authTokens);
    }
    // Proceed with request
    config.headers = {
        Authorization : `Bearer ${authTokens?.access}`
    }

    let { response,data } = await originalRequest(url , config);
    return {response , data};
};
