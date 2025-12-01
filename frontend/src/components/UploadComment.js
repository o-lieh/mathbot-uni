import React, { useState } from 'react';
import config from '../utils/config.js';
import IsAuthenticated from "../utils/IsAuthenticated.js";
import { Link } from 'react-router-dom';

function UploadComment(props) {

    const post = props.postId

    const [formData, setFormData] = useState({
      content: "",
      post_id: post,
    });

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }; 
    
    const handleSubmit = async (e) => {
      e.preventDefault();

      const TokenConfig = config();

      try {
        const response = await TokenConfig.post("/comments/create/", formData);
        console.log("Post created:", response.data);
        alert("دیدگاه شما با موفقیت ارسال شد");
        window.location.reload();
      } catch (error) {
        console.error("Error creating post:", error.response.data);
        alert("ارسال نشد! یه مشکلی وجود داره")
      }
    };

    if (IsAuthenticated() === "Not Authenticated") {
      return (
        <>
          <p>جهت ارسال دیدگاه ابتدا <Link to="/login">وارد شوید</Link></p>
        </>
      )
    } else {
      return (
        <div className="your-answer-box">
            <form onSubmit={handleSubmit}>
                <div className="ask-description">
                  <textarea
                    placeholder="نظر خود را درباره این پست بنویسید"
                    className='ask-description-textarea'
                    name="content"
                    onChange={handleChange}
                  />
                </div>
                <div className="ask-button">
                    <button className="ask-input-button" type="submit">ارسال</button>
                </div>
            </form>
        </div>
      );
    }
}

export default UploadComment;