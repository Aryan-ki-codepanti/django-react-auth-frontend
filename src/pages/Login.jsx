import React from "react";

const Login = () => {
    return (
        <div>
            <form>
                <input
                    type="text"
                    name="username"
                    placeholder="Enter Username"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                />
                <input type="submit" value="Login" />
            </form>
        </div>
    );
};

export default Login;
