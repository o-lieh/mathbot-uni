import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";
import ContestRegisterModal from "../components/ContestRegisterModal.js";
import "../assets/scss/pages/_competitionDetails.scss";

function CompetitionDetails() {
    const { id } = useParams();
    const [contest, setContest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openRegister, setOpenRegister] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetch(`http://127.0.0.1:8000/api/contests/${id}/`)
            .then((res) => {
                if (!res.ok) throw new Error("Contest not found");
                return res.json();
            })
            .then((data) => {
                setContest(data);
                setError(null);
            })
            .catch(() => setError("Error loading contest"))
            .finally(() => setLoading(false));
    }, [id]);

    const handleDownloadRules = () => {
        if (!contest.rules) {
            alert("Rules file not available");
            return;
        }

        const link = document.createElement("a");
        link.href = contest.pdf_rules;
        link.download = "Contest-Rules.pdf";
        link.click();
    };

    if (loading) return <p>Loading...</p>;
    if (error || !contest) return <p>{error || "Contest not found"}</p>;

    return (
        <>
            <Header />

            <div className="competition-details-page section">
                <div className="container">
                    <div className="details-grid">
                        <section className="info-box">
                            <h3>{contest.title}</h3>
                            <ul>
                                <li>
                                    <strong>{contest.location}</strong><i className="fas fa-map-marker-alt colored-icon"></i>
                                </li>
                                <li>
                                    <strong>{contest.date}</strong><i className="fas fa-calendar-alt colored-icon"></i>
                                </li>
                                <li>
                                    <strong>{contest.time}</strong><i className="fas fa-clock colored-icon"></i>
                                </li>
                                <li>
                                    <strong><i className="fab fa-ethereum colored-icon "></i> for winner : {contest.prize} </strong><i className="fas fa-trophy colored-icon"></i>
                                </li>
                                <li>
                                    <strong><i className="fab fa-ethereum colored-icon "></i> Registration fee : {contest.registration_price}</strong><i className="fas fa-coins colored-icon"></i>
                                </li>
                                <li className="rules-download" onClick={handleDownloadRules}>
                                    <strong>Contest Rules (PDF)</strong><i className="fas fa-scroll colored-icon"></i>
                                </li>
                            </ul>
                        </section>

                        <section className="join-box">
                            <div className="competition-image-wrapper">
                                <img
                                    src={contest.image}
                                    alt={contest.title}
                                    className="competition-image"
                                />
                            </div>

                            {/* 🔴 فقط این خط تغییر کرده: */}
                            <button
                                className="join-btn"
                                onClick={() => setOpenRegister(true)}
                            >
                                {contest.registration_price > 0 
                                    ? `Register (${contest.registration_price} ETH)`
                                    : "Register for Free"
                                }
                            </button>
                        </section>
                    </div>
                </div>
            </div>

            <Footer />

            {/* Registration Modal */}
            {openRegister && (
                <ContestRegisterModal
                    contestId={contest.id}
                    onClose={() => setOpenRegister(false)}
                />
            )}
        </>
    );
}

export default CompetitionDetails;