import React from "react";
import { Helmet } from 'react-helmet';
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";
import CompetitionBar from "../components/CompetitionBar.js";
import ContestLargeBoxIntroduction from "../components/ContestLargeBoxIntroduction.js";

function Home() {
    return (
        <div>

            {/* Header */}
            <Header />
            <Helmet>
                <title>Mathbot</title>
                <meta name="keywords" content="مث بات, mathbot"></meta>
            </Helmet>

            <div className="section">
            <div className="container ">
                
                <div className="row">
                        <div className="col-md-12">
                            <ContestLargeBoxIntroduction />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <CompetitionBar />
                        </div>
                    </div>



            </div>
          </div>
            {/* Footer */}
            <Footer />

        </div>
    );
}

export default Home;
