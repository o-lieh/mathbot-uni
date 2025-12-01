import React from "react";
import { Link } from "react-router-dom";
import '../assets/scss/pages/_ContestLargeBoxIntroduction.scss';


function ContestLargeBoxIntroduction() {
    return (
        <div className="contest-section">
            <div className="contest-homepage ">
                <h2>
                    <div>INTERNATIONAL</div>
                    <div>PROGRAMIN COMPETITION</div>
                </h2>
                
                <Link to="/soon">
                    <button className="contest-register-button">
                        Let's go...!
                    </button>
                </Link>
            </div>
        </div>
    );    
}

export default ContestLargeBoxIntroduction;
