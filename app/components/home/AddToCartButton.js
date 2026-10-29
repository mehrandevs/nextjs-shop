"use client";
import { useCart } from "@/app/context/CartContext";
import React, { useState } from "react";
import { Button } from "react-bootstrap";

const AddToCartButton = ({ productId }) => {
  const { addToCart, error } = useCart();
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  console.log(error);

  const handleAddToCart = async () => {
    setLoading(true);
    setLocalError(null);

    await addToCart(productId, 1);

    if (error) {
      setLocalError(error);
    }
    setLoading(false);
  };
  return (
    <section className="">
      <Button variant="danger" onClick={handleAddToCart} disabled={loading}>
        {loading ? "در حال افزودن...." : "افزودن به سبد خرید "}
      </Button>
      {error && <p>{localError}</p>}
    </section>
  );
};

export default AddToCartButton;
