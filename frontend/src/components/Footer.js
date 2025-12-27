// Footer.jsx
import React from "react";
import IsAuthenticated from "../utils/IsAuthenticated.js";
import logo from "../assets/images/MATHBOTrect.png";
import { Link } from "react-router-dom";
import '../assets/scss/pages/_footer.scss';

function Footer() {
    const auth = IsAuthenticated();

    return (
        <footer className="footer">
            <div className="container">
                <div className="row">
                
                     <div className="col-md-3 footer-right">
                        <div className="footer-links">
                           <p><Link className="about-link" to="/about-us">ABOUT US</Link></p>
                           <p className="contact-text">Contact Us</p>
                        </div>
                    


                        <div className="contact-links">
                            <a className="contact-icons-sidebar" href="http://instagram.com/themathbot"><i className="fab fa-instagram" /></a>
                            <a className="contact-icons-sidebar" href="http://t.me/math_20_bot_channel"><i className="fab fa-telegram" /></a>
                            <a className="contact-icons-sidebar" href="https://github.com/o-lieh/mathbot-uni"><i className="fab fa-github" /></a>
                            <a className="contact-icons-sidebar" href="https://github.com/o-lieh/mathbot-uni"><i className="fab fa-linkedin" /></a>
                            
                            
                        </div>
                    </div>
                    <div className="col-md-9 footer-left">
                        <div className="row logo-imaage">
                            <h3 className="col-md-8">MATH BOT</h3>
                            <img className="logo-img col-md-4" src={logo} alt="MATHBOT Logo" />
                            
                        </div>
                        <div className="footer-left-text">
                            
                            <p>A platform for programming competitions and coding challenges</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
