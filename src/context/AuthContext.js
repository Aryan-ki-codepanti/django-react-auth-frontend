import { createContext, useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router";

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() =>
        localStorage.getItem("authTokens")
            ? jwtDecode(JSON.parse(localStorage.getItem("authTokens")).access)
            : null
    );
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem("authTokens")
            ? JSON.parse(localStorage.getItem("authTokens"))
            : null
    );
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const loginUser = async e => {
        e.preventDefault();
        const res = await fetch("http://127.0.0.1:8000/api/token/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: e.target.username.value,
                password: e.target.password.value
            })
        });
        const data = await res.json();
        if (res.status === 200) {
            setAuthTokens(prev => data);
            setUser(prev => jwtDecode(data.access));
            localStorage.setItem("authTokens", JSON.stringify(data));
            navigate("/");
        } else {
            alert("Something Went Wrong");
        }
    };

    const logoutUser = () => {
        setAuthTokens(prev => null);
        setUser(prev => null);
        localStorage.removeItem("authTokens");
        navigate("/login");
    };

    
    // const updateToken = async () => {
    //     const res = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify({
    //             refresh: authTokens?.refresh
    //         })
    //     });
    //     const data = await res.json();
    //     if (res.status === 200) {
    //         setAuthTokens(prev => data);
    //         setUser(prev => jwtDecode(data.access));
    //         localStorage.setItem("authTokens", JSON.stringify(data));
    //     } else {
    //         logoutUser();
    //     }

    //     if (loading){
    //         setLoading(prev => false);
    //     }

    // };
    
    useEffect(() => {

        if (authTokens){
            setUser(prev => jwtDecode(authTokens.access));
        };
        setLoading(prev => false);

    }, [authTokens]);

    const contextData = {
        user,
        authTokens,
        setUser,
        setAuthTokens,
        loginUser,
        logoutUser
    };

    return (
        <AuthContext.Provider value={contextData}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
