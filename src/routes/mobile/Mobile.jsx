import React, { useState } from "react";
import "./Mobile.css";
import { toast } from "react-toastify";
import { auth } from "../../config/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { url } from "../../config/constant";
import Loading from "../../components/loading";
export default function Mobile() {
  const [mobile, setMobile] = useState("");
  const [vid, setVid] = useState("");
  const [otp, setOTP] = useState("");
  const [loading, setLoading] = useState(false);
  const generateRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "sign-in-button", {
        size: "invisible",
        callback: (response) => {
          setLoading(true);

          // reCAPTCHA solved, allow signInWithPhoneNumber.
          submitNumber();
        },
      });
    }
  };

  async function submitNumber() {
    generateRecaptcha();

    console.log("loading");
    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, `+977${mobile}`, appVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        setVid(confirmationResult.verificationId);
        console.log("sms sent");
        console.log(confirmationResult);
        // ...
      })
      .catch((error) => {
        // Error; SMS not sent
        // ...
        console.log(error);
        toast.error("invalid mobile number");
      })
      .finally(() => {
        setLoading(false);
      });
  }
  async function verifyNumber() {
    setLoading(true);
    // var credential = auth.PhoneAuthProvider.credential(
    //   window.confirmationResult.verificationId,
    //   otp
    // );
    // auth.signInWithCredential(credential);
    window.confirmationResult
      .confirm(otp)
      .then(async (result) => {
        // User signed in successfully.
        const user = result.user;
        console.log(user);
        localStorage.setItem("access_token", user.accessToken);
        await fetch(`${url}/user/${user.phoneNumber}`).then((res) => {
          if (res.status === 200) {
            window.location = "/home";
          } else {
            window.location = `/register/${user.phoneNumber}`;
          }
        });
      })
      .catch((error) => {
        // User couldn't sign in (bad verification code?)
        // ...
        console.log(error);
        toast.error("Invalid otp");
      })
      .finally(() => setLoading(false));
  }
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
            <span>
              {vid === "" && <>Enter your Mobile Number:</>}
              {vid !== "" && (
                <>
                  Enter the OTP sent to :
                  <br />
                  <b>+977-{mobile}</b>
                </>
              )}
            </span>
          </div>
          <br />
          {vid === "" && (
            <input
              type="tel"
              required
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className=" input"
              id="phone"
              name="Mobile Number"
              placeholder="+977-98XXXXXXXX"
            />
          )}
          {vid !== "" && (
            <input
              type="number"
              required
              value={otp}
              onChange={(e) => setOTP(e.target.value)}
              className=" input"
              id="phone"
              name="OTP"
              placeholder="000000"
            />
          )}
          <br />
          <br />
          {loading ? (
            <Loading />
          ) : (
            <button
              type="submit"
              id="sign-in-button"
              className="button"
              onClick={() => {
                if (vid === "") {
                  submitNumber();
                } else {
                  verifyNumber();
                }
              }}
            >
              <p>Next</p>
            </button>
          )}
        </div>
      </div>
    </>
  );
}
