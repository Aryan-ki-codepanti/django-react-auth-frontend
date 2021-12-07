import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { customFetcher } from "../utils/FetchInstance";
// import { useAxios } from '../utils/useAxios';
import {useFetch} from '../utils/useFetch.js';

const Home = () => {
    const api = useFetch();
    const [notes, setNotes] = useState([]);
    const { authTokens, logoutUser } = useContext(AuthContext);
    
    const getNotes = async () => {
        // const res = await fetch("http://localhost:8000/api/notes/" , {
        //     method: "GET",
        //     headers: {
        //         "Content-Type" : "application/json",
        //         "Authorization" : `Bearer ${authTokens.access}`
        //     }
        // });
        // const data = await res.json();

        // const res = await api.get("/api/notes/");
        // const { data } = res;
        // if (res.status === 200){
            // }
            const { response, data } = await api("/api/notes/");
            if (response.status === 200){
                setNotes(prev => data);
            }
    };

    useEffect(() => {
        getNotes();
    }, []);

    return (
        <div>
            <h3>You are logged to the Home Page !</h3>
            <ul>
                {notes.map(note => (
                    <li key={note.id}>{note.body}</li>
                ))}
            </ul>
        </div>
    );
};

export default Home;
