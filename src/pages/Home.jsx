import React, { useState , useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Home = () => {
    const [notes, setNotes] = useState([]);
    const { authTokens , logoutUser } = useContext(AuthContext);
    console.log({authTokens});
    const getNotes = async () => {
        const res = await fetch("http://localhost:8000/api/notes/" , {
            method: "GET",
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${authTokens.access}`
            }
        });
        const data = await res.json();
        if (res.status === 200){
            setNotes(prev => data);
        }
        else if (res.statusText === "Unauthorized"){
            logoutUser();
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
    )
};

export default Home;
