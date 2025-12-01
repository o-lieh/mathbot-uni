import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import IsAuthenticated from "../utils/IsAuthenticated.js";
import logo from "../assets/images/MATHBOTrect.png"
import API_URL from '../utils/api.js';
import '../assets/scss/pages/_header.scss';

function Header() {

    const [data, setdata] = useState([])

    useEffect(() => {
        if (IsAuthenticated() !== "Not Authenticated") {
            axios.get(`${API_URL}/api/accounts/` + IsAuthenticated()).then((res) => {
                setdata(res.data)
            })
        }
    }, [])

    function userData() {
        return (
            <>
                <Link title={data.name} to="/account">
                    <img src={data.avatar} className="account-user-img-little-header" alt={data.name} />
                </Link>

                <Link title="اعلانات" to="/notifications">
                    <div className="header-buttons">
                        <i class="fa-regular fa-bell header-buttons-ico"></i>
                    </div>
                </Link>
            </>
        )
    }

    return (
        <div className="header">
            <div className="row">

                <div className="col-md-11 header-responsive header-icons-box">
                    
                    {IsAuthenticated() !== "Not Authenticated" ? userData() : (
                        <Link to="/login">
                            <div className="header-buttons header-buttons-login">       
                                Login
                            </div>
                        </Link>
                    )}

                    
                    

                    <Link title="صفحه اصلی" to="/">
                        <div className="header-buttons">
                            <i className="fa-solid fa-house header-buttons-ico"></i>
                        </div>
                    </Link>

                </div>

                <div className="col-md-1">
                    <div className="logo-button">
                        <Link to="/">
                            <img className="logo-img" src={logo} alt="MATHBOT Logo" />
                        </Link>
                    </div>
                </div>
                
            </div>
        </div>
    );
}

export default Header;