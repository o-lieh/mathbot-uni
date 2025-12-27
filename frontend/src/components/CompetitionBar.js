import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/pagination";
import "../assets/scss/pages/_competitionBar.scss";

function CompetitionBar() {
  const [contests, setContests] = useState([]);

  useEffect(() => {

	fetch("http://127.0.0.1:8000/api/contests/")
      .then(res => res.json())
      .then(data => {
        setContests(data);
      })
      .catch(err => console.error("Error fetching contests:", err));
  }, []);
    // --------- API Call ---------
    // Uncomment this section to fetch contests from your backend
    /*
    async function fetchContests() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/contests/"); 
        const data = await response.json();
        setContests(data);
      } catch (error) {
        console.error("Failed to load contests", error);
      }
    }

    fetchContests();
    */

    // --------- Test Data (for local testing without API) ---------
/*    
const testContests = [
      {
        id: 1,
        title: "مسابقه برنامه نویسی",
        image: "../backend/media/events/blue_ZRcWZUs.jpg",
      },
      {
        id: 2,
        title: "مسابقه طراحی گرافیک",
        image: "../backend/media/events/blue_ZRcWZUs.jpg",
      },
      {
        id: 3,
        title: "مسابقه ریاضی",
        image: "../backend/media/events/blue_ZRcWZUs.jpg",
      },
    ];

    setContests(testContests);
  }, []);
*/

  return (
    <div className="competition-bar">
      <div className="title">
        <h2>Upcoming Contests</h2>
      </div>

      <Swiper
        modules={[Pagination, Autoplay]}
        slidesPerView={3}
        spaceBetween={25}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        breakpoints={{
          320: { slidesPerView: 1, spaceBetween: 10 },
          768: { slidesPerView: 2, spaceBetween: 15 },
          1024: { slidesPerView: 3, spaceBetween: 25 },
        }}
      >
        {contests.map((contest) => (
          <SwiperSlide key={contest.id}>
            <div className="contest-card">
              <img src={contest.image} alt={contest.title} className="contest-image" />

              <h3>{contest.title}</h3>

              {/* Link to contest details page */}
              <Link to={`/contests/${contest.id}`} className="details-link">
                Details
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default CompetitionBar;
