import React, { useEffect, useState } from "react";
import "./User.css";
import { Add, CloseCircle, Home2, SearchNormal, User } from "iconsax-react";
import { toast } from "react-toastify";
import Loading from "../../components/loading";
import { getHeaders, url } from "../../config/constant";
import { Link } from "react-router-dom";

export default function UserPage() {
  const [selected, setSelected] = useState("Lend Request");
  const [selectedCategory, setSelectedCategory] = useState("AllCategories");
  const categories = [
    "AllCategories",
    "Management",
    "Engineering",
    "Medical",
    "Business",
  ];
  const [dialog, setDialog] = useState(false);
  const [requests, setRequests] = useState([]);
  const [image, setImage] = useState("");
  const [selectedFile, setSelectedFile] = useState();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

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
  async function loadData() {
    setLoading(true);
    const header = await await getHeaders();
    fetch(
      `${url}/request/${
        selected === "Lend Request" ? "donations" : "requests"
      }`,
      {
        headers: header,
      }
    )
      .then(async (res) => {
        const body = await res.json();
        if (res.status !== 200) return toast.error(body.message);
        setRequests([...body]);
      })
      .catch((e) => toast.error(e))
      .finally(() => setLoading(false));
  }
  useEffect(() => {
    loadData();
  }, [selected]);
  return (
    <div className="p-5">
      <div
        className={`fixed -m-5 w-full z-20 bg-white ${!dialog && "hidden"}`}
        style={{
          height: "100vh!important",
        }}
      >
        <br />
        <div className="flex justify-end">
          <div onClick={() => setDialog(false)} className="p-2">
            <CloseCircle />
          </div>
        </div>
        <center>
          <label htmlFor="image">
            {uploading ? (
              <span>
                <Loading />
              </span>
            ) : (
              <img
                src={image === "" ? "/uploadBookImage.png" : image}
                className="z-10"
                alt=""
                style={{
                  width: "200px",
                  height: "200px",
                  borderRadius: "12px",

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
        <br />
        <br />
        <div className="relative p-5">
          Product Name
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Product Name"
            className="bg-slate-200 rounded-2xl p-3 w-full"
          />
          Product Name
          <textarea
            type="text"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Product Description"
            className="bg-slate-200 h-32 rounded-2xl p-3 w-full"
          />
          Category:
          <div className="w-full flex overflow-x-scroll overflow-y-hidden h-12">
            {categories.map(
              (category, index) =>
                index !== 0 && (
                  <div
                    onClick={() => setSelectedCategory(category)}
                    className={`p-3 w-full ${
                      category === selectedCategory &&
                      "bg-black text-white rounded-3xl px-5"
                    }`}
                  >
                    {category}
                  </div>
                )
            )}
          </div>
          <br />
          {loading ? (
            <Loading />
          ) : (
            <button
              onClick={async () => {
                let location = null;
                let latitude = null;
                let longitude = null;
                if (window.navigator && window.navigator.geolocation) {
                  location = window.navigator.geolocation;
                } else {
                  return toast.error("please provide location permission.");
                }

                if (location) {
                  if (selectedCategory === "")
                    return toast.error("please select a category");
                  if (image === "")
                    return toast.error("please upload an image of book");
                  location.getCurrentPosition(async function (position) {
                    latitude = position.coords.latitude.toString();
                    longitude = position.coords.longitude.toString();
                    setLoading(true);
                    await fetch(`${url}/product/create`, {
                      method: "POST",
                      headers: await getHeaders(),
                      body: JSON.stringify({
                        title,
                        desc,
                        images: [image],
                        category: selectedCategory,
                        latitude,
                        longitude,
                      }),
                    })
                      .then(async (res) => {
                        const body = await res.json();
                        if (res.status === 200) {
                          toast.success("Book posted Successfully");
                          setDialog(false);
                          window.location = "/home";
                        } else {
                          toast.error(body.message);
                        }
                      })
                      .catch((err) => toast.error(err))
                      .finally(() => {
                        setLoading(false);
                      });
                  });
                }
              }}
              className="button"
            >
              Post
            </button>
          )}
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </div>

        <br />
        <br />
        <br />
      </div>
      <h3 className="text-3xl font-bold">History</h3>
      <br />
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full flex overflow-x-scroll overflow-y-hidden h-12">
          {["Lend Request", "Borrow Request"].map((category) => (
            <div
              onClick={() => setSelected(category)}
              className={`p-3 w-full ${
                category === selected && "bg-black text-white rounded-3xl px-5"
              }`}
            >
              <center> {category}</center>
            </div>
          ))}
        </div>
      )}
      <div className="p-5">
        {requests.map((request) => (
          <div className="bg-white p-3  rounded-3xl mt-16 relative  ">
            <div className="flex gap-x-3">
              <div className="w-24 h-24">
                <img
                  className="rounded-3xl absolute -top-10 left-3  object-cover  w-24 h-24 overflow-hidden mx-auto"
                  src={request.product.images[0]}
                  alt={request.title}
                />
              </div>
              <div className="relative">
                <p className="text-left absolute -top-12">
                  {request.product.title}
                </p>

                <b>
                  {request.taker.name} ({request.taker.gender})
                </b>

                <p className="text-slate-500">{request.desc}</p>
              </div>
            </div>
            <div>
              <br />
              {request.status === "" && (
                <div className="flex justify-end items-center space-x-3">
                  <button
                    onClick={async () => {
                      setLoading(true);
                      fetch(`${url}/request/reject/${request._id}`, {
                        headers: await getHeaders(),
                      })
                        .then(async (res) => {
                          const body = await res.json();
                          if (res.status !== 200) throw body.message;
                          loadData();
                        })
                        .catch((err) => {
                          toast.error(err);
                        })
                        .finally(() => {
                          setLoading(false);
                        });
                    }}
                    className="border-2 hover:bg-red-200 border-red-600 rounded-xl px-8 py-1"
                  >
                    Reject
                  </button>
                  <button
                    onClick={async () => {
                      setLoading(true);
                      fetch(`${url}/request/accept/${request._id}`, {
                        headers: await getHeaders(),
                      })
                        .then(async (res) => {
                          const body = await res.json();
                          if (res.status !== 200) throw body.message;
                          loadData();
                        })
                        .catch((err) => {
                          toast.error(err);
                        })
                        .finally(() => {
                          setLoading(false);
                        });
                    }}
                    className="bg-primary hover:bg-blue-800 text-white rounded-xl px-8 py-1"
                  >
                    Accept
                  </button>
                </div>
              )}
              <div className="flex justify-between">
                <div>
                  {request.status !== "" && selected === "Lend Request" && (
                    <p className="text-slate-500">{request.taker.mobile}</p>
                  )}
                  {request.status !== "" && selected !== "Lend Request" && (
                    <p className="text-slate-500">{request.donar.mobile}</p>
                  )}
                </div>
                <div>
                  {request.status === "accepted" && (
                    <span className="text-green-500">Accepted</span>
                  )}
                  {request.status === "rejected" && (
                    <span className="text-red-500">Rejected</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <br />
      <br />
      <div class="wrapper">
        {/* <div class="page">Body</div> */}
        <div class="bottom-appbar">
          <div class="tabs">
            <Link to={"/home"} class="tab is-active tab--left">
              <Home2 variant="Bold" className="text-black" />
            </Link>
            <div class="tab tab--fab">
              <div class="top">
                <div
                  class="fab"
                  onClick={() => {
                    setDialog((prev) => !prev);
                  }}
                >
                  <Add />
                </div>
              </div>
            </div>
            <Link to={"/user"} class="tab tab--right">
              <User variant="Bold" className="text-primary" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
