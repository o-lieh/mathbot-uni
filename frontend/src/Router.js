import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './screens/Home.js';
import About from './screens/About.js';
import Contest from './screens/Contest.js';
import Login from './screens/Login.js';
import Register from './screens/Register.js';
import Account from './screens/Account.js';
import NotFoundPage from './screens/NotFoundPage.js';
import Search from './screens/Search.js';
import Users from './screens/Users.js';
import Notifications from './screens/Notifications.js';
import CompetitionDetails from './screens/CompetitionDetails.js';

class Router extends Component {
    render () {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} exact />
                    <Route path="/about" element={<About />} exact />
            
                    <Route path="/login" element={<Login />} exact />
                    <Route path="/register" element={<Register />} exact />
                    <Route path="/account" element={<Account />} exact />
                    <Route path="/Search" element={<Search />} exact />
                    <Route path="/notifications" element={<Notifications />} exact />
                    <Route path="/users/:username" element={<Users />} exact />
                    <Route path="/contests/:id" element={<CompetitionDetails />} />
    
                    <Route path="/contests/:id" element={<Contest />} exact />
                    <Route element={<NotFoundPage />} exact />
                </Routes>
            </BrowserRouter>
        );
    }
}

export default Router;