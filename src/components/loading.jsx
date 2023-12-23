import React from "react";
import ClipLoader from "react-spinners/ClipLoader";
export default function Loading() {
  return (
    <center>
      <ClipLoader
        color={"#0A69F6"}
        loading={true}
        size={30}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </center>
  );
}
