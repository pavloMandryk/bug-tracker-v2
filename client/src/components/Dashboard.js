import React, {Fragment, useState, useEffect } from 'react'

const Dashboard = ({setAuth}) => {

    const [name, setName] = useState("");

    const getName = async() => {
        try {
            const response = await fetch("http://localhost:5000/dashboard", {
                method: "GET",
                headers: { token: localStorage.token }
            });
            const parseRes = await response.json();

            setName(parseRes.user_name);

        } catch (err) {
            console.error(err.message)
        }
    } 
    useEffect(() => {
        getName();
    }, []);
    const logout = (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        setAuth(false);
    }
    return (
        <Fragment>
            <h1>DashBoard</h1>
            <div>
                <h3>{`Hello ${name}`}</h3>
            </div>
            <button onClick={e => logout(e)}>logout</button>

            <Projects />

        </Fragment>
    );
};

export default Dashboard;
