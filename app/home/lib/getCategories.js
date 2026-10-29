import React from "react";

const getCategories = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories/home-menu`,
    { next: { revalidate: 60 } },
  );
  if (!res.ok) {
    throw new Error("مشکلی در دریفات دسته بندی ها  رخ داده است ");
  }
  return res.json();
};

export default getCategories;
