import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";
import "../assets/scss/pages/_competitionDetails.scss";

function CompetitionDetails() {
    const { id } = useParams();
    const [contest, setContest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Download rules
    const handleDownloadRules = () => {
        if (!contest.rules) {
            alert("فایل قوانین موجود نیست");
            return;
        }

        const link = document.createElement("a");
        link.href = contest.rules;  // backend link or test link
        link.download = "";
        link.click();
    };

    useEffect(() => {
        // ------------------ API Fetch ------------------
        /*
        const fetchContest = async () => {
            try {
                const response = await fetch(`https://api.example.com/contests/${id}`);
                if (!response.ok) throw new Error("مسابقه یافت نشد");
                const data = await response.json();
                setContest(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchContest();
        */

        // ------------------ Test Data ------------------
        const testContests = [
            {
                id: "1",
                title: "Programming Contest",
                description: "Solve fun programming challenges!",
                location: "Online",
                date: "2025-12-10",
                time: "10:00 AM",
                prize: "$500",
                image: "https://via.placeholder.com/400x250.png?text=Programming+Contest",
                rules: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
            },
            {
                id: "2",
                title: "Graphic Design Contest",
                description: "Create stunning visuals.",
                location: "New York",
                date: "2025-12-15",
                time: "2:00 PM",
                prize: "$300",
                image: "https://via.placeholder.com/400x250.png?text=Design+Contest",
                rules: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
            },
            {
                id: "3",
                title: "Math Challenge",
                description: "Test your math skills!",
                location: "London",
                date: "2025-12-20",
                time: "11:00 AM",
                prize: "$200",
                image: "https://via.placeholder.com/400x250.png?text=Math+Contest",
                rules: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
            },
        ];

        const foundContest = testContests.find(c => c.id === id);
        if (foundContest) setContest(foundContest);
        else setError("Contest not found");
        setLoading(false);

    }, [id]);

    if (loading) {
        return (
            <div>
                <Header />
                <div className="container">
                    <h2 className="mt-5">Loading...</h2>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !contest) {
        return (
            <div>
                <Header />
                <div className="container">
                    <h2 className="mt-5">{error || "Contest not found"}</h2>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Header />

            <Helmet>
                <title>{contest.title}</title>
            </Helmet>

            <div className="competition-details-page section">
                <div className="container">

                    <div className="details-grid">
                        {/* Info box */}
                        <section className="info-box">
                            <h3>Contest Details</h3>
                            <ul>
                                <li><strong>Location:</strong> {contest.location}<i class="fas fa-map-marker-alt"></i></li>
                                <li><strong>Date:</strong> {contest.date}<i class="fas fa-calendar-alt"></i></li>
                                <li><strong>Time:</strong> {contest.time} <i class="fas fa-clock"></i></li>
                                <li><strong>Prize:</strong> {contest.prize}<i class="fas fa-trophy"></i></li>
                                <li className="rules-download" onClick={handleDownloadRules}>
                                    <strong>Contest Rules</strong><i class="fas fa-scroll"></i>
                                </li>
                            </ul>
                        </section>

                        {/* Join box */}
                        <section className="join-box">
                            

                            {/* Competition Image */}
                            <div className="competition-image-wrapper">
                                <img
                                    src={contest.image}
                                    alt={contest.title}
                                    className="competition-image"
                                />
                            </div>

                            <button className="join-btn">Register</button>
                        </section>

                    </div>

                </div>
            </div>

            <Footer />
        </div>
    );
}

export default CompetitionDetails;
