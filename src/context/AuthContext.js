import { createContext , useState , useEffect } from "react";
import jwtDecode from "jwt-decode";

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null);
    const [authTokens, setAuthTokens] = useState(null);

    const loginUser = async (e) => {
        e.preventDefault();
        const res = await fetch("http://127.0.0.1:8000/api/token/" , {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username:e.target.username.value,
                password:e.target.password.value
            })
        });
        const data = await res.json();
        if (res.status === 200){
            setAuthTokens(prev => data);
            setUser(prev => jwtDecode(data.access));
        }
        else{
            alert("Something Went Wrong");
        }
    }

    const contextData = {
        user,
        authTokens,
        setUser,
        setAuthTokens,
        loginUser
    }


    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
};