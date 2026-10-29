"use client";
import React, { useState } from "react";
import "../styles/cart.css";
import { useCart } from "../context/CartContext";
import Image from "next/image";
import { toast } from "react-toastify";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Link from "next/link";
import CartItemSkeleton from "../components/home/CartItemSkeleton";

const Cart = () => {
  const {
    cart,
    removeFromCart,
    decreaseQuantity,
    increaseQuantity,
    loading,
    error,
  } = useCart();
  const [loadingItem, setLoadingItem] = useState(null);

  toast.error(error);

  return (
    <SkeletonTheme direction="rtl" baseColor="#ececec" highlightColor="#f8f8f8">
      <main id="main-body-one-col" className="main-body">
        <section className="mb-4">
          <section className="container-xxl">
            <section className="row">
              <section className="col">
                <section className="content-header">
                  <section className="d-flex justify-content-between align-items-center">
                    <h2 className="content-header-title">
                      <span>سبد خرید شما</span>
                    </h2>
                    <section className="content-header-link"></section>
                  </section>
                </section>

                <section className="row mt-4">
                  <section className="col-md-9 mb-3">
                    <section className="content-wrapper bg-white p-3 rounded-2">
                      {loading ? (
                        <>
                          <CartItemSkeleton />
                        </>
                      ) : !cart || cart.items.length === 0 ? (
                        "سبد خرید خالی است"
                      ) : (
                        cart.items.map((item) => (
                          <section
                            className="cart-item d-md-flex py-3"
                            key={item.product?._id || item._id}
                          >
                            <section className="cart-img align-self-start flex-shrink-1">
                              {item.product?.imageUrl ? (
                                <Image
                                  src={item.product.imageUrl}
                                  width={80}
                                  height={80}
                                  alt={item.product?.name}
                                  className="w-auto h-auto"
                                />
                              ) : (
                                <span>تصویر موجود نیست</span>
                              )}
                            </section>
                            <section className="align-self-start w-100">
                              <p className="fw-bolder fs-4 mb-2">
                                {item.product?.name || "محصول نا مشخص"}
                              </p>

                              <p className="fs-7">
                                <i className="fa fa-shield-alt cart-product-selected-warranty me-1"></i>{" "}
                                <span>گارانتی اصالت و سلامت فیزیکی کالا</span>
                              </p>
                              <p className="fs-7">
                                <i className="fa fa-store-alt cart-product-selected-store me-1"></i>{" "}
                                <span>کالا موجود در انبار :</span>
                                <span className="text-success fs-6">
                                  {item.product?.stock}
                                </span>
                              </p>
                              <section>
                                <section className="cart-product-number d-inline-block">
                                  <button
                                    className="cart-number-down"
                                    type="button"
                                    disabled={
                                      item.quantity <= 1 ||
                                      loadingItem === item.product?._id
                                    }
                                    onClick={async () => {
                                      setLoadingItem(item.product?._id);
                                      await decreaseQuantity(item.product?._id);
                                      setLoadingItem(null);
                                    }}
                                  >
                                    {loadingItem === item.product?._id
                                      ? "..."
                                      : "-"}
                                  </button>
                                  <input
                                    type="number"
                                    value={item.quantity}
                                    readOnly
                                  />
                                  <button
                                    className="cart-number-up"
                                    type="button"
                                    disabled={
                                      item.quantity >=
                                        (item.product?.stock || 0) ||
                                      loadingItem === item.product?._id
                                    }
                                    onClick={async () => {
                                      setLoadingItem(item.product?._id);
                                      await increaseQuantity(item.product?._id);
                                      setLoadingItem(null);
                                    }}
                                  >
                                    {loadingItem === item.product?._id
                                      ? "..."
                                      : "+"}
                                  </button>
                                </section>
                                <a
                                  className="text-decoration-none ms-4 cart-delete"
                                  onClick={() =>
                                    removeFromCart(item.product?._id)
                                  }
                                >
                                  <i className="fa fa-trash-alt"></i>
                                  حذف از سبد
                                </a>
                              </section>
                            </section>
                            <section className="align-self-end flex-shrink-1">
                              <section className="text-nowrap fw-bold">
                                {item.product?.price?.toLocaleString()} تومان
                              </section>
                            </section>
                          </section>
                        ))
                      )}
                    </section>
                  </section>

                  <section className="col-md-3">
                    <section className="content-wrapper bg-white p-3 rounded-2 cart-total-price">
                      <section className="d-flex justify-content-between align-items-center">
                        <p className="fs-8">
                          جمع سبد خرید{" "}
                          {loading ? (
                            <Skeleton width={20} inline />
                          ) : (
                            <span className="text-danger">
                              ({cart.items.length})
                            </span>
                          )}
                        </p>
                        <p className="fw-bolder">
                          {loading ? (
                            <Skeleton width={90} />
                          ) : (
                            <>
                              {cart.items
                                .reduce(
                                  (total, item) =>
                                    total +
                                    (item.product?.price || 0) * item.quantity,
                                  0,
                                )
                                .toLocaleString()}{" "}
                              تومان
                            </>
                          )}
                        </p>
                      </section>
                      <section className="border-bottom mb-3"></section>

                      <p className="my-3">
                        <i className="fa fa-info-circle me-1"></i>کاربر گرامی
                        خرید شما هنوز نهایی نشده است. برای ثبت سفارش و تکمیل
                        خرید باید ابتدا آدرس خود را انتخاب کنید و سپس نحوه ارسال
                        را انتخاب کنید. نحوه ارسال انتخابی شما محاسبه و به این
                        مبلغ اضافه شده خواهد شد. و در نهایت پرداخت این سفارش
                        صورت میگیرد.
                      </p>

                      <section>
                        <Link
                          href={"/address"}
                          className="btn btn-danger d-block"
                        >
                          تکمیل فرآیند خرید
                        </Link>
                      </section>
                    </section>
                  </section>
                </section>
              </section>
            </section>
          </section>
        </section>
      </main>
    </SkeletonTheme>
  );
};

export default Cart;
