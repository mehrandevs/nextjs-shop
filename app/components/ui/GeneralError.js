"use client";
import React, { useEffect } from "react";
import { Alert, Button } from "react-bootstrap";

const GeneralError = ({ error, onRetry = null }) => {
  useEffect(() => {
    console.log(error);
  }, [error]);

  const message =
    typeof error === "string"
      ? error
      : error?.message || "خطای رخ داده است؛ لطفا مجددا تلاش کنید";

  return (
    <div className="d-flex flex-column align-items-center my-4">
      <Alert variant="danger">{message}</Alert>
      {onRetry && (
        <Button className="mt-3" variant="primary" onClick={onRetry}>
          تلاش مجدد
        </Button>
      )}
    </div>
  );
};

export default GeneralError;
