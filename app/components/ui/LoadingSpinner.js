import React from "react";
import { Spinner } from "react-bootstrap";

const LoadingSpinner = () => {
  return (
    <div>
      <div className="d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="success">
          <span className=" visually-hidden">در حال بارگذاری ...</span>
        </Spinner>
      </div>
    </div>
  );
};

export default LoadingSpinner;
