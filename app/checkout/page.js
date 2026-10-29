"use client";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import "../styles/payment.css";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CartItemSkeleton from "../components/home/CartItemSkeleton";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Alert } from "react-bootstrap";
const Checkout = () => {
  const { cart, loading, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscountCode, setAppliedDiscount] = useState(0);
  const [discountError, setDiscountError] = useState(null);
  const [isAppliedDiscountCode, setIsAppliedDiscount] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!cart || cart.items.length === 0) {
      toast.warning("سبد خرید خالی است");
      router.replace("/cart");
    }
    if (!cart.shippingAddress?.address) {
      toast.warning("ابتدا آدرس ارسال را انتخاب کنید");
      router.replace("/address");
    }
  }, [loading]);

  useEffect(() => {
    if (cart && cart.discountPrice > 0) {
      setAppliedDiscount(cart.discountPrice);
      setIsAppliedDiscount(true);
    }
  }, [cart]);
  const totalPrice = cart?.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  const payableAmount = totalPrice - appliedDiscountCode + cart.shippingCost;

  const applyDiscount = async () => {
    if (isAppliedDiscountCode) {
      setDiscountError("شما قبلا کد تخفیف اعمال کرداید ");
      return;
    }
    setDiscountError("");

    if (!discountCode.trim()) {
      setDiscountError("کد تخفیف را وارد کنید");
      return;
    }
    try {
      const res = await fetch("/api/discounts/verify", {
        method: "POST",
        body: JSON.stringify({ code: discountCode }),
      });

      const data = await res.json();
      if (res.status === 400) {
        setDiscountError(data.message || "کد تخفیف وارد شده معتبر نیست ");
        return;
      }
      if (!res.ok) {
        toast.error("مشکلی در اعمال کد تخفیف پیش امده است ");
        return;
      }

      setAppliedDiscount(data.discountPrice);
      setIsAppliedDiscount(true);
    } catch (error) {
      setDiscountError(error.message || "مشکلی در ارتباط با سرور پیش آمده است");
    }
  };

  const handleOrderSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "مشکلی در ثبت سفارش پیش آمده است ");
      }
      toast.success("سفارش شما با موفقیت  ثبت شده است ");
      clearCart();
    } catch (error) {
      throw new Error("مشکلی در ارتباط با سرور پیش آمده است");
    } finally {
      setSubmitting(false);
    }
  };
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
                      <span>انتخاب نوع پرداخت </span>
                    </h2>
                    <section className="content-header-link">
                      {/* <!--<a href="#">مشاهده همه</a>--> */}
                    </section>
                  </section>
                </section>

                <section className="row mt-4">
                  <section className="col-md-9">
                    <section className="content-wrapper bg-white p-3 rounded-2 mb-4">
                      <section className="content-header mb-3">
                        <section className="d-flex justify-content-between align-items-center">
                          <h2 className="content-header-title content-header-title-small">
                            کد تخفیف
                          </h2>
                          <section className="content-header-link">
                            {/* <!--<a href="#">مشاهده همه</a>--> */}
                          </section>
                        </section>
                      </section>
                      <Alert
                        className="d-flex align-items-center p-2  "
                        variant={discountError ? "danger" : "primary"}
                      >
                        <i className="fa fa-info-circle flex-shrink-0 me-2"></i>
                        <section>
                          {discountError
                            ? discountError
                            : "کد تخفیف خود را در این بخش وارد کنید."}
                        </section>
                      </Alert>

                      <section className="row">
                        <section className="col-md-5">
                          <section className="input-group input-group-sm">
                            <input
                              type="text"
                              className="form-control"
                              value={discountCode}
                              onChange={(e) => setDiscountCode(e.target.value)}
                              placeholder={
                                isAppliedDiscountCode
                                  ? "شما قبلا کد تخفیف اعمال کرداید"
                                  : "کد تخفیف را وارد کنید"
                              }
                              disabled={isAppliedDiscountCode}
                            />
                            <button
                              className="btn btn-primary"
                              type="button"
                              onClick={applyDiscount}
                              disabled={isAppliedDiscountCode}
                            >
                              اعمال کد
                            </button>
                          </section>
                        </section>
                      </section>
                    </section>

                    <section className="content-wrapper bg-white p-3 rounded-2 mb-4">
                      <section className="content-header mb-3">
                        <section className="d-flex justify-content-between align-items-center">
                          <h2 className="content-header-title content-header-title-small">
                            محصول ها
                          </h2>
                        </section>
                      </section>
                      <section className="payment-select">
                        {loading ? (
                          <>
                            <CartItemSkeleton />
                          </>
                        ) : (
                          cart.items.map((item) => (
                            <section
                              className="content-wrapper bg-white p-3 rounded-2 mb-2"
                              key={item.product?._id || item._id}
                            >
                              <section className="cart-item d-md-flex py-3">
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
                                    <span>
                                      گارانتی اصالت و سلامت فیزیکی کالا
                                    </span>
                                  </p>
                                  <p className="fs-7">
                                    <i className="fa fa-store-alt cart-product-selected-store me-1"></i>{" "}
                                    <span>تعداد سفارش ثبت شده :</span>
                                    <span className="text-success fs-6">
                                      {item.quantity}
                                    </span>
                                  </p>
                                  <p className="fs-7">
                                    <i className="fa fa-shopping-cart cart-product-selected-store me-1"></i>{" "}
                                    <span>قیمت هر محصول:</span>
                                    <span className="text-success fs-6">
                                      {item.product?.price?.toLocaleString()}
                                    </span>
                                    تومان
                                  </p>
                                  <section></section>
                                </section>
                                <section className="align-self-end flex-shrink-1">
                                  <section className="text-nowrap fw-bold">
                                    <span>جمع مبلغ:</span>
                                    {(
                                      item.quantity * item.product?.price
                                    ).toLocaleString()}{" "}
                                    تومان
                                  </section>
                                </section>
                                <hr />
                              </section>
                            </section>
                          ))
                        )}
                      </section>
                    </section>
                  </section>
                  <section className="col-md-3">
                    <section className="content-wrapper bg-white p-3 rounded-2 cart-total-price">
                      <section className="d-flex justify-content-between align-items-center">
                        <p className="text-muted">
                          قیمت کالاها ({loading ? "0" : cart?.items?.length})
                        </p>
                        <p className="text-muted">
                          {loading ? "0" : totalPrice.toLocaleString()} تومان
                        </p>
                      </section>

                      <section className="border-bottom mb-3"></section>

                      <section className="d-flex justify-content-between align-items-center">
                        <p className="text-muted">هزینه ارسال</p>
                        <p className="text-warning">
                          {loading ? "0" : cart?.shippingCost?.toLocaleString()}{" "}
                          تومان
                        </p>
                      </section>

                      <section className="d-flex justify-content-between align-items-center">
                        <p className="text-muted">تخفیف اعمال شده</p>
                        <p className="text-danger">
                          {" "}
                          {loading
                            ? "0"
                            : appliedDiscountCode?.toLocaleString()}{" "}
                          تومان
                        </p>
                      </section>

                      <p className="my-3">
                        <i className="fa fa-info-circle me-1"></i> کاربر گرامی
                        کالاها بر اساس نوع ارسالی که انتخاب می کنید در مدت زمان
                        ذکر شده ارسال می شود.
                      </p>

                      <section className="border-bottom mb-3"></section>

                      <section className="d-flex justify-content-between align-items-center">
                        <p className="text-muted">مبلغ قابل پرداخت</p>
                        <p className="fw-bold">
                          {" "}
                          {loading ? "0" : payableAmount?.toLocaleString()}{" "}
                          تومان
                        </p>
                      </section>

                      <section className="">
                        <button
                          type="button"
                          className={`btn btn-danger w-100 `}
                          onClick={handleOrderSubmit}
                          disabled={submitting}
                        >
                          {submitting ? "در حال پردازش..." : "ثبت سفارش"}
                        </button>
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

export default Checkout;
