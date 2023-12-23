import React, { useEffect, useState } from "react";
import "./Register.css";
import { useParams } from "react-router-dom";
import Loading from "../../components/loading";
import { getHeaders, url } from "../../config/constant";
import { toast } from "react-toastify";

export default function Register() {
  let { mobile } = useParams();
  const [gender, setGender] = useState("male");
  const [image, setImage] = useState("");
  const [selectedFile, setSelectedFile] = useState();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState("");
  useEffect(() => {
    async function uploadFile() {
      setImage("");
      if (!selectedFile) return;
      setUploading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("upload_preset", "my-upload");

      formData.append("resource_type ", "image");

      await fetch("https://api.cloudinary.com/v1_1/dmybkl5mt/raw/upload", {
        method: "POST",
        body: formData,
      })
        .then(async (response) => {
          const decod = await response.json();

          if (response.status !== 200) {
            toast.error("error uploading image");
          } else {
            setImage(decod.secure_url);
          }
        })
        .catch((error) => {
          toast.error(error);
        })
        .finally(() => {
          setUploading(false);
        });
    }
    uploadFile();
  }, [selectedFile]);
  return (
    <>
      <div className="body">
        <div className="body-photo">
          <div className="image"></div>
        </div>

        <div className="content">
          <center>
            <label htmlFor="image">
              {uploading ? (
                <span
                  style={{
                    marginTop: "-80px",
                  }}
                >
                  <Loading />
                </span>
              ) : (
                <img
                  src={image === "" ? "/uploadImage.png" : image}
                  alt=""
                  style={{
                    marginTop: "-80px",
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    overflow: "hidden",
                  }}
                />
              )}
            </label>
          </center>
          <input
            type="file"
            name=""
            style={{ display: "none" }}
            id="image"
            onChange={(event) => {
              setSelectedFile(event.target.files?.[0]);
            }}
          />
          <div className="first">
            <span className="blue">Share</span>
            <span>Me</span>
          </div>
          <span>Enter your Details.</span>
          <div></div>
          <b>Full Name</b>

          <input
            className="input"
            type="text"
            required
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            name="Name"
            placeholder="John Doe"
          />
          <div></div>
          <b>Mobile Number</b>

          <input
            className="input"
            type="text"
            required
            id="name"
            name="Name"
            value={mobile}
            disabled
          />
          <div></div>
          <b>Gender</b>

          <div className="genderflex ">
            <div
              onClick={() => setGender("male")}
              className={`gender-chip ${gender === "male" && "active"}`}
            >
              <img src="/male.png" alt="male" />
              <span>Male</span>
            </div>
            <div
              onClick={() => setGender("female")}
              className={`gender-chip ${gender === "female" && "active"}`}
            >
              <img src="/female.png" alt="male" />
              <span>Female</span>
            </div>
          </div>
          <br />
          {loading ? (
            <Loading />
          ) : (
            <button
              type="submit"
              id="sign-in-button"
              className="button"
              onClick={async () => {
                if (image === "" || uploading) return;
                console.log(await getHeaders());
                setLoading(true);
                await fetch(`${url}/user/create`, {
                  method: "POST",
                  headers: await getHeaders(),
                  body: JSON.stringify({
                    name,
                    gender,
                    image,
                  }),
                })
                  .then(async (res) => {
                    const body = await res.json();
                    if (res.status === 200) {
                      window.location = "/home";
                    } else {
                      toast.error(body.message);
                    }
                  })
                  .catch((err) => toast.error(err))
                  .finally(() => {
                    setLoading(false);
                  });
              }}
            >
              Save Details
            </button>
          )}
        </div>
      </div>
    </>
  );
}
