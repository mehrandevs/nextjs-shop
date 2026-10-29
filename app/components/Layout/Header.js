"use client";
import { useCart } from "@/app/context/CartContext";
import getCategories from "@/app/home/lib/getCategories";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button, Offcanvas } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";

const Header = () => {
  const { status, data } = useSession();
  const [user, setUser] = useState([]);
  const [show, setShow] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cart } = useCart();

  useEffect(() => {
    if (status === "loading") {
      setUser("");
      return;
    }
    if (status === "unauthenticated") {
      setUser("");
      return;
    }
    if (status === "authenticated") {
      setUser(data?.user);

      return;
    }
  }, [status]);

  const totalItems =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        if (!Array.isArray(data)) {
          throw new Error("داده های دریافتی معتبر نمباشند");
        }
        setCategories(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <header className="header mb-4">
      <section className="top-header">
        <section className="container-xxl ">
          <section className="d-md-flex justify-content-md-between align-items-md-center py-3">
            {/* قسمت لوکو و دکمه */}
            <section className="d-flex justify-content-between align-items-center d-md-block">
              <Link href={"/"}>
                <Image
                  src="/images/logo/8.png"
                  alt="logo"
                  width={80}
                  height={40}
                  priority
                  style={{ width: "80px", height: "auto" }}
                />
              </Link>
              <button
                className="btn btn-link text-dark d-md-none"
                type="button"
                onClick={handleShow}
              >
                <i className="fa fa-bars me-1"></i>
              </button>
            </section>
            {/* سرچ بار  */}
            <section className="mt-3 mt-md-auto search-wrapper">
              <section className="search-box">
                <section className="search-textbox">
                  <span>
                    <i className="fa fa-search"></i>
                  </span>
                  <input
                    id="search"
                    type="text"
                    className=""
                    placeholder="جستجو ..."
                    autoComplete="off"
                  />
                </section>
                {/* قسمت سرچ بار  */}
                {/* <section className="search-result visually-hidden">
                  <section className="search-result-title">
                    نتایج جستجو برای{" "}
                    <span className="search-words">"موبایل شیا"</span>
                    <span className="search-result-type">در دسته بندی ها</span>
                  </section>
                  <section className="search-result-item">
                    <a className="text-decoration-none" href="#">
                      <i className="fa fa-link"></i> دسته موبایل و وسایل جانبی
                    </a>
                  </section>

                  <section className="search-result-title">
                    نتایج جستجو برای{" "}
                    <span className="search-words">"موبایل شیا"</span>
                    <span className="search-result-type">در برندها</span>
                  </section>
                  <section className="search-result-item">
                    <a className="text-decoration-none" href="#">
                      <i className="fa fa-link"></i> برند شیائومی
                    </a>
                  </section>
                  <section className="search-result-item">
                    <a className="text-decoration-none" href="#">
                      <i className="fa fa-link"></i> برند توشیبا
                    </a>
                  </section>
                  <section className="search-result-item">
                    <a className="text-decoration-none" href="#">
                      <i className="fa fa-link"></i> برند شیانگ پینگ
                    </a>
                  </section>

                  <section className="search-result-title">
                    نتایج جستجو برای{" "}
                    <span className="search-words">"موبایل شیا"</span>
                    <span className="search-result-type">در کالاها</span>
                  </section>
                  <section className="search-result-item">
                    <span className="search-no-result">موردی یافت نشد</span>
                  </section>
                </section> */}
              </section>
            </section>
            {/* ثبد خرید و user */}
            <section className="mt-3 mt-md-auto text-end">
              <Dropdown className="d-inline px-md-3">
                <Dropdown.Toggle
                  className="btn btn-link text-decoration-none text-dark dropdown-toggle profile-button"
                  id="dropdown-basic"
                >
                  <i className="fa fa-user "></i>
                </Dropdown.Toggle>
                {status === "loading" ? (
                  <SkeletonTheme direction="rtl">
                    <Dropdown.Menu className="custom-drop-down">
                      <Dropdown.Item href="/auth/login">
                        <Skeleton width={100} height={40} />
                      </Dropdown.Item>
                      <Dropdown.Item>
                        <Skeleton width={100} height={40} />
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </SkeletonTheme>
                ) : status === "unauthenticated" ? (
                  <Dropdown.Menu className="custom-drop-down">
                    <Dropdown.Item href="/auth/login">
                      <i className="fa fa-user-circle"></i>ورود
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <i className="fa fa-user-plus"></i>ثبت نام
                    </Dropdown.Item>
                  </Dropdown.Menu>
                ) : (
                  <Dropdown.Menu className="custom-drop-down">
                    {" "}
                    {user && user?.name ? (
                      <>
                        <Dropdown.Item
                          href="my-favorites.html"
                          className="fs-6"
                        >
                          <i className="fa fa-user"></i>
                          {user.name}
                        </Dropdown.Item>
                        <Dropdown.Divider />
                      </>
                    ) : (
                      ""
                    )}
                    <Dropdown.Item href="/panel/my-profile">
                      <i className="fa fa-user-circle"></i>پروفایل کاربری
                    </Dropdown.Item>
                    <Dropdown.Item href="/panel/my-orders">
                      <i className="fa fa-newspaper"></i>سفارشات
                    </Dropdown.Item>
                    <Dropdown.Item href="my-favorites.html">
                      <i className="fa fa-heart"></i>لیست علاقه مندی
                    </Dropdown.Item>
                    {user && user?.isAdmin === true ? (
                      <>
                        <Dropdown.Item href="/admin">
                          <i className="fa fa-user"></i>دانشبود
                        </Dropdown.Item>
                      </>
                    ) : (
                      ""
                    )}
                    {status === "authenticated" ? (
                      <>
                        <Dropdown.Divider />
                        <Dropdown.Item>
                          <Button
                            onClick={() => {
                              signOut();
                            }}
                            className="btn"
                            variant="danger"
                          >
                            <i className="fa fa-sign-out-alt"></i>خروج
                          </Button>
                        </Dropdown.Item>
                      </>
                    ) : (
                      ""
                    )}
                  </Dropdown.Menu>
                )}
              </Dropdown>

              <section className="header-cart d-inline ps-3 border-start position-relative">
                <Link
                  href={"/cart"}
                  className="btn btn-link position-relative text-dark header-cart-link"
                >
                  <i className="fa fa-shopping-cart"></i>{" "}
                  {totalItems > 0 && (
                    <span
                      style={{ top: "80%" }}
                      className="position-absolute start-0 translate-middle badge rounded-pill bg-danger"
                    >
                      {totalItems}
                    </span>
                  )}
                </Link>
                {/* <section className="header-cart-dropdown">
                  <section className="border-bottom d-flex justify-content-between p-2">
                    <span className="text-muted">2 کالا</span>
                    <a
                      className="text-decoration-none text-info"
                      href="cart.html"
                    >
                      مشاهده سبد خرید{" "}
                    </a>
                  </section>
                  <section className="header-cart-dropdown-body">
                    <section className="header-cart-dropdown-body-item d-flex justify-content-start align-items-center">
                      <img className="flex-shrink-1" src="assets/images/products/1.jpg" alt="">

                      <section className="w-100 text-truncate">
                        <a className="text-decoration-none text-dark" href="#">
                          کتاب اثر مرکب اثر دارن هاردی انتشارات معیار علم
                        </a>
                      </section>
                      <section className="flex-shrink-1">
                        <a
                          className="text-muted text-decoration-none p-1"
                          href="#"
                        >
                          <i className="fa fa-trash-alt"></i>
                        </a>
                      </section>
                    </section>

                    <section className="header-cart-dropdown-body-item d-flex justify-content-start align-items-center">
                      <img className="flex-shrink-1" src="assets/images/products/2.jpg" alt="">

                      <section className="w-100 text-truncate">
                        <a className="text-decoration-none text-dark" href="#">
                          دستگاه آبمیوه گیری دنویر با کد 1016
                        </a>
                      </section>
                      <section className="flex-shrink-1">
                        <a
                          className="text-muted text-decoration-none p-1"
                          href="#"
                        >
                          <i className="fa fa-trash-alt"></i>
                        </a>
                      </section>
                    </section>
                  </section>
                  <section className="header-cart-dropdown-footer border-top d-flex justify-content-between align-items-center p-2">
                    <section className="">
                      <section>مبلغ قابل پرداخت</section>
                      <section> 1,326,000 تومان</section>
                    </section>
                    <section className="">
                      <a
                        className="btn btn-danger btn-sm d-block"
                        href="cart.html"
                      >
                        ثبت سفارش
                      </a>
                    </section>
                  </section>
                </section> */}
              </section>
            </section>
          </section>
        </section>
      </section>

      <nav className="top-nav">
        <section className="container-xxl ">
          <nav className="">
            <section className="d-none d-md-flex justify-content-md-start position-relative">
              {loading ? (
                <SkeletonTheme direction="rtl">
                  <section className="navbar-item ms-2 p-2">
                    <Skeleton width={100} height={20} />
                  </section>
                  <section className="navbar-item ms-2 p-2">
                    <Skeleton width={100} height={20} />
                  </section>
                  <section className="navbar-item ms-2 p-2">
                    <Skeleton width={100} height={20} />
                  </section>
                  <section className="navbar-item ms-2 p-2">
                    <Skeleton width={100} height={20} />
                  </section>
                </SkeletonTheme>
              ) : (
                categories.map((category) => {
                  return (
                    <section className="navbar-item" key={category._id}>
                      <a href="#">{category.name}</a>
                    </section>
                  );
                })
              )}
            </section>

            <Offcanvas
              style={{ zIndex: "9999999" }}
              show={show}
              onHide={handleClose}
            >
              <Offcanvas.Header className="offcanvas-header" closeButton>
                <Offcanvas.Title>
                  <Link href={"/"}>
                    <Image
                      src="/images/logo/8.png"
                      alt="logo"
                      width={80}
                      height={40}
                      priority
                      style={{ width: "80px", height: "auto" }}
                    />
                  </Link>
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                {categories.map((category) => {
                  return (
                    <section className="navbar-item" key={category._id}>
                      <a href="#">{category.name}</a>
                    </section>
                  );
                })}
              </Offcanvas.Body>
            </Offcanvas>
          </nav>
        </section>
      </nav>
    </header>
  );
};

export default Header;
