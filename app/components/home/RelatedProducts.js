"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
const RelatedProducts = ({ categoryId }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRelatedProduct = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/home/related?category=${categoryId}`,
        );
        if (!response.ok) {
          throw new Error("خطا در دریفات اطلاعات");
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("خطا در دریفات اطلاعات");
        }

        setRelatedProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRelatedProduct();
  }, [categoryId]);

  useEffect(() => {
    if (relatedProducts.length > 0) {
      $(".owl-carousel").owlCarousel({
        items: 4,
        loop: true,
        autoplay: true,
        rtl: true,
        responsive: {
          0: { items: 1 },
          576: { items: 2 },
          768: { items: 3 },
          992: { items: 4 },
        },
      });
    }
  }, [relatedProducts]);
  if (loading) return <div>در حال بارگذاری...</div>;
  if (error) return <div>خطا در بارگذاری دیتا</div>;

  return (
    <section className="mb-4">
      <section className="container-xxl">
        <section className="row">
          <section className="col">
            <section className="content-wrapper bg-white p-3 rounded-2">
              <section className="content-header">
                <section className="d-flex justify-content-between align-items-center">
                  <h2 className="content-header-title">
                    <span>کالاهای مرتبط</span>
                  </h2>
                  <section className="content-header-link">
                    {/* <!--<a href="#">مشاهده همه</a>--> */}
                  </section>
                </section>
              </section>
              <section className="lazyload-wrapper">
                <section className="lazyload light-owl-nav owl-carousel  owl-theme">
                  {relatedProducts.map((relatedProduct) => {
                    return (
                      <section className="item" key={relatedProduct._id}>
                        <section className="lazyload-item-wrapper">
                          <section className="product">
                            <section className="product-add-to-cart">
                              <a
                                href="#"
                                data-bs-toggle="tooltip"
                                data-bs-placement="left"
                                title="افزودن به سبد خرید"
                              >
                                <i className="fa fa-cart-plus"></i>
                              </a>
                            </section>
                            <section className="product-add-to-favorite">
                              <a
                                href="#"
                                data-bs-toggle="tooltip"
                                data-bs-placement="left"
                                title="افزودن به علاقه مندی"
                              >
                                <i className="fa fa-heart"></i>
                              </a>
                            </section>
                            <Link
                              className="product-link"
                              href={`/products/${relatedProduct._id}`}
                            >
                              <section className="product-image">
                                <Image
                                  src={relatedProduct.imageUrl}
                                  width={200}
                                  height={200}
                                  alt={relatedProduct.name}
                                  className="w-auto h-auto"
                                />
                              </section>
                              <section className="product-colors"></section>
                              <section className="product-name">
                                <h3>{relatedProduct.name}</h3>
                              </section>
                              <section className="product-price-wrapper">
                                {/* <section className="product-discount">
                <span className="product-old-price">6,895,000</span>
                <span className="product-discount-amount">10%</span>
              </section> */}
                                <section className="product-price">
                                  {relatedProduct.price}
                                </section>
                              </section>
                            </Link>
                          </section>
                        </section>
                      </section>
                    );
                  })}
                </section>
              </section>
            </section>
          </section>
        </section>
      </section>
    </section>
  );
};

export default RelatedProducts;
