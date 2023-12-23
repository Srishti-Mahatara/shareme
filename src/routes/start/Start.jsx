import "./Start.css";
import { ArrowRight } from "iconsax-react";
import { Link } from "react-router-dom";
function Start() {
  return (
    <>
      <div className="body">
        <div className="body-photo">
          <div className="image"></div>
        </div>

        <div className="content">
          <div className="first">
            <span className="blue">Share</span>
            <span>Me</span>
          </div>
          <div className="second">
            <span>Share your things to those who really need it.</span>
          </div>
          <br />
          <br />
          <center>
            <Link to="/mobile" className="icon">
              <ArrowRight size="32" color="white" />
            </Link>
          </center>
        </div>
      </div>
    </>
  );
}

export default Start;
