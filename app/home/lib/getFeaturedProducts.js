import React from "react";

const getFeaturedProducts = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/featured`,
    { next: { revalidate: 60 } },
  );
  if (!res.ok) {
    throw new Error("مشکلی در دریفات محصولات پربازدید رخ داده است ");
  }
  return res.json();
};

export default getFeaturedProducts;
