import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getHeaders, url } from "../../config/constant";

import GoogleMapReact from "google-map-react";
import { Location, Map } from "iconsax-react";
import Loading from "../../components/loading";

export default function Product() {
  let { id } = useParams();
  const [product, setProduct] = useState();
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const page = 1;
  useEffect(() => {
    fetch(`${url}/product/${id}`).then(async (res) => {
      const body = await res.json();
      if (res.status != 200) return toast.error("no product found");
      setProduct(body);
      console.log(body);
    });
  }, [page]);
  if (!product) return <></>;
  return (
    <div>
      <div className=" p-5">
        <img
          className=" rounded-3xl overflow-hidden"
          src={product.images[0]}
          alt={product.title}
        />
      </div>
      <h2 className="text-2xl font-bold px-5">{product.title}</h2>{" "}
      <p className="px-5">{product.desc}</p>
      <div style={{ height: "90vw", width: "100%" }}>
        {/* <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyBULo4a_0EflZdjjRzOqdGQBuLftnctlb0" }}
          defaultCenter={{
            lat: parseFloat(product.latitude),
            long: parseFloat(product.longitude),
          }}
          defaultZoom={11}
        ></GoogleMapReact> */}
        <div className="p-5">
          <iframe
            className="rounded-3xl w-full"
            height={240}
            frameBorder="0"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps/embed/v1/view?key=AIzaSyBULo4a_0EflZdjjRzOqdGQBuLftnctlb0&center=-${product.latitude},${product.longitude}&zoom=5&maptype=roadmap`}
            allowFullScreen
          ></iframe>
          <br />
          Why do you need this ?
          <br />
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-white rounded-3xl h-32 p-3"
            placeholder="write short description on why you are requesting this product ..."
          ></textarea>
          <br />
          <br />
          {loading ? (
            <Loading />
          ) : (
            <button
              onClick={async () => {
                setLoading(true);
                await fetch(`${url}/request/create`, {
                  method: "POST",
                  headers: await getHeaders(),
                  body: JSON.stringify({
                    product: id,
                    desc: reason,
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
              className="button"
            >
              Request Book
            </button>
          )}
        </div>
        <br />
      </div>
    </div>
  );
}
