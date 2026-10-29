"use client";
import React, { useEffect, useState } from "react";
import "../../styles/filter.css";
import "../../styles/profile.css";
import Link from "next/link";
import Image from "next/image";
import SidebarPanel from "@/app/components/ui/SidebarPanel";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";
import CartItemSkeleton from "@/app/components/home/CartItemSkeleton";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/panel/orders");
        if (!res.ok) {
          setError("سفارشش ها دریفات نشده ");
          return;
        }
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        setError("مشکلی در ارتباط با سرور پیش آمده است");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <section className="">
      <section id="main-body-two-col" className="container-xxl body-container">
        <section className="row">
          <SidebarPanel />
          <main id="main-body" className="main-body col-md-9">
            <section className="content-wrapper bg-white p-3 rounded-2 mb-2">
              <section className="content-header">
                <section className="d-flex justify-content-between align-items-center">
                  <h2 className="content-header-title">
                    <span>تاریخچه سفارشات</span>
                  </h2>
                  <section className="content-header-link">
                    {/* <!--<a href="#">مشاهده همه</a>--> */}
                  </section>
                </section>
              </section>

              <section className="d-flex justify-content-center my-4">
                <a className="btn btn-info btn-sm mx-1" href="#">
                  در انتظار پرداخت
                </a>
                <a className="btn btn-warning btn-sm mx-1" href="#">
                  در حال پردازش
                </a>
                <a className="btn btn-success btn-sm mx-1" href="#">
                  تحویل شده
                </a>
                <a className="btn btn-danger btn-sm mx-1" href="#">
                  مرجوعی
                </a>
                <a className="btn btn-dark btn-sm mx-1" href="#">
                  لغو شده
                </a>
              </section>

              <section className="content-header mb-3">
                <section className="d-flex justify-content-between align-items-center">
                  <h2 className="content-header-title content-header-title-small">
                    در انتظار پرداخت
                  </h2>
                  <section className="content-header-link">
                    {/* <!--<a href="#">مشاهده همه</a>--> */}
                  </section>
                </section>
              </section>
              <SkeletonTheme direction="rtl">
                <section className="order-wrapper">
                  {error && error}
                  {loading ? (
                    <section className="order-item">
                      <section className="d-flex justify-content-between">
                        <section>
                          <section className="order-item-date">
                            <i className="fa fa-calendar-alt"></i>{" "}
                            <Skeleton width={230} className="mb-1" />
                          </section>

                          <section className="order-item-id">
                            <i className="fa fa-id-card-alt"></i>{" "}
                            <Skeleton width={230} className="mb-1" />
                          </section>

                          <section className="order-item-status">
                            <i className="fa fa-clock"></i>{" "}
                            <Skeleton width={230} className="mb-1" />
                          </section>

                          <section className="order-item-products">
                            <Skeleton width={80} height={80} />
                          </section>
                        </section>

                        <section className="d-flex flex-column">
                          <p>
                            <Skeleton width={90} height={20} />
                          </p>
                          <p>
                            <Skeleton width={90} height={20} />
                          </p>
                          <p>
                            <Skeleton width={90} height={20} />
                          </p>
                          <p>
                            <Skeleton width={90} height={20} />
                          </p>
                        </section>
                      </section>
                    </section>
                  ) : !orders || orders.length === 0 ? (
                    <p>هیچ سفارشی ثبت نشده است</p>
                  ) : (
                    orders.map((order) => (
                      <section className="order-item" key={order._id}>
                        <section className="d-flex justify-content-between">
                          <section>
                            <section className="order-item-date">
                              <i className="fa fa-calendar-alt"></i>{" "}
                              {new Date(order.createdAt).toLocaleDateString(
                                "fa-IR",
                              )}
                            </section>

                            <section className="order-item-id">
                              <i className="fa fa-id-card-alt"></i> کد سفارش:{" "}
                              {order._id}
                            </section>

                            <section className="order-item-status">
                              <i className="fa fa-clock"></i> {order.status}
                            </section>

                            <section className="order-item-products">
                              {order.items.map((item, i) =>
                                item.product ? (
                                  <Link
                                    href={`/products/${item.product._id}`}
                                    key={item.product._id ?? i}
                                  >
                                    <Image
                                      src={item.product.imageUrl}
                                      alt={item.product.name}
                                      width={60}
                                      height={60}
                                    />
                                  </Link>
                                ) : null,
                              )}
                            </section>
                          </section>

                          <section className="d-flex flex-column">
                            <p>
                              مبلغ کل:{" "}
                              {order.totalPrice?.toLocaleString("fa-IR")} تومان
                            </p>
                            <p>
                              مبلغ تخفیف:{" "}
                              {order.discountPrice?.toLocaleString("fa-IR")}{" "}
                              تومان
                            </p>
                            <p>
                              مبلغ ارسال:{" "}
                              {order.shippingCost?.toLocaleString("fa-IR")}{" "}
                              تومان
                            </p>
                            <p>
                              مبلغ نهایی:{" "}
                              {order.finalPrice?.toLocaleString("fa-IR")} تومان
                            </p>
                          </section>
                        </section>
                      </section>
                    ))
                  )}
                </section>
              </SkeletonTheme>
            </section>
          </main>
        </section>
      </section>
    </section>
  );
};

export default MyOrders;
