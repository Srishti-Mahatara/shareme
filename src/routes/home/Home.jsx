import React, { useEffect, useState } from "react";
import "./Home.css";
import { Add, CloseCircle, Home2, SearchNormal, User } from "iconsax-react";
import { toast } from "react-toastify";
import Loading from "../../components/loading";
import { getHeaders, url } from "../../config/constant";
import { Link } from "react-router-dom";

export default function Home() {
  const [selected, setSelected] = useState("AllCategories");
  const [selectedCategory, setSelectedCategory] = useState("AllCategories");
  const categories = [
    "AllCategories",
    "Management",
    "Engineering",
    "Medical",
    "Business",
  ];
  const [dialog, setDialog] = useState(false);
  const [products, setProducts] = useState([]);
  const [image, setImage] = useState("");
  const [selectedFile, setSelectedFile] = useState();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [search, setSearch] = useState("");

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
  useEffect(() => {
    setLoading(true);
    fetch(
      `${url}/product/?search=${search}&category=${
        selected === "AllCategories" ? "" : selected
      }`
    )
      .then(async (res) => {
        const body = await res.json();
        if (res.status !== 200) return toast.error(body.message);
        setProducts([...body]);
      })
      .catch((e) => toast.error(e))
      .finally(() => setLoading(false));
  }, [search, selected]);
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
      <h3 className="text-3xl font-bold">Products</h3>
      <div className="p-5 gap-2 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search Product"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white rounded-2xl p-3 w-full"
        />
        <button className="bg-primary rounded-2xl p-3">
          <SearchNormal variant="Bold" color="white" />
        </button>
      </div>

      <div className="w-full flex overflow-x-scroll overflow-y-hidden h-12">
        {categories.map((category) => (
          <div
            onClick={() => setSelected(category)}
            className={`p-3 w-full ${
              category === selected && "bg-black text-white rounded-3xl px-5"
            }`}
          >
            {category}
          </div>
        ))}
      </div>
      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-2 gap-x-2 gap-y-1">
          {products.map((product) => (
            <Link
              to={`/product/${product._id}`}
              className="bg-white rounded-3xl mt-16 relative h-44 hover:bg-slate-200"
            >
              <img
                className="rounded-3xl absolute -top-12 object-cover left-0 right-0 w-40 h-40 overflow-hidden mx-auto"
                src={product.images[0]}
                alt={product.title}
              />
              <div className="w-full relative h-32  block"></div>
              <div>
                <center>{product.title}</center>
              </div>
            </Link>
          ))}
        </div>
      )}
      <div class="wrapper">
        {/* <div class="page">Body</div> */}
        <div class="bottom-appbar">
          <div class="tabs">
            <Link to={"/home"} class="tab is-active tab--left">
              <Home2 variant="Bold" className="text-primary" />
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
              <User variant="Bold" className="text-black" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
