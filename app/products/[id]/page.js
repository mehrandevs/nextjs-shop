import AddToCartButton from "@/app/components/home/AddToCartButton";
import ProductDetails from "@/app/components/home/ProductDetails";
import ProductGallery from "@/app/components/home/ProductGallery";
import RelatedProducts from "@/app/components/home/RelatedProducts";
import React from "react";

async function getProductData(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/home/${id}`,
    {
      next: { revalidate: 60 },
      cache: "force-cache",
    },
  );

  if (!res.ok) {
    throw new Error("خطا در دریافت اطلاعات");
  }

  return res.json();
}

const SingleProduct = async ({ params }) => {
  const { id } = await params;

  const product = await getProductData(id);

  return (
    <main id="main-body-one-col" className="main-body">
      <section className="mb-4">
        <section className="container-xxl">
          <section className="col">
            <section className="content-header">
              <section className="d-flex justify-content-between align-items-center">
                <h2 className="content-header-title">
                  <span>{product.name}</span>
                </h2>
                <section className="content-header-link">
                  {/* <a href="#">مشاهده همه</a> */}
                </section>
              </section>
            </section>
          </section>
          <section className="row mt-4">
            <section className="col-md-4">
              <ProductGallery images={product.imageUrl} />
            </section>
            <section className="col-md-5">
              <ProductDetails
                name={product.name}
                description={product.description}
                stock={product.stock}
                category={product.category}
              />
            </section>
            <section className="col-md-3">
              <section className="content-wrapper bg-white p-3 rounded-2 cart-total-price">
                <section className="d-flex justify-content-between align-items-center fw-bolder">
                  <p className="">قیمت کالا</p>
                  <p className="">
                    {product.price.toLocaleString()}{" "}
                    <span className="small">تومان</span>
                  </p>
                </section>

                <AddToCartButton productId={product._id} />
              </section>
            </section>
          </section>
        </section>
      </section>
      <RelatedProducts categoryId={product.category._id} />
    </main>
  );
};

export default SingleProduct;
