"use client";
import SidebarPanel from "@/app/components/ui/SidebarPanel";
import React, { useEffect, useState } from "react";
import "../../styles/profile.css";
import Link from "next/link";
const myAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(addresses);

  useEffect(() => {
    const fetchAddresses = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/address");
        if (!res.ok) {
          setError("خطا در دیافت ادرس ");
        }
        const data = await res.json();
        setAddresses(data.addresses);
      } catch (error) {
        setError("مشکلی در ارتباط با سرور پیش آمده است");
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, []);
  return (
    <section className="">
      <section id="main-body-two-col" className="container-xxl body-container">
        <section className="row">
          <SidebarPanel />
          <main id="main-body" className="main-body col-md-9">
            <section className="content-wrapper bg-white p-3 rounded-2 mb-2">
              <section className="content-header mb-4">
                <section className="d-flex justify-content-between align-items-center">
                  <h2 className="content-header-title">
                    <span>آدرس های من</span>
                  </h2>
                  <section className="content-header-link">
                    <Link href={"/panel/my-addresses/add"}>ساخت ادرس جدید</Link>
                  </section>
                </section>
              </section>

              <section className="my-addresses">
                {loading
                  ? "در حال بارگذاری ادرس ها .."
                  : addresses.length <= 0
                    ? "هیچ ادرس دریافت نیشد"
                    : addresses.map((address) => {
                        return (
                          <section
                            className="my-address-wrapper mb-2 p-2"
                            key={address._id}
                          >
                            <section className="mb-2">
                              <i className="fa fa-map-marker-alt mx-1"></i>
                              {address.address}
                            </section>
                            <section className="mb-2">
                              <i className="fa fa-map-marker-alt mx-1"></i>
                              کد پستی : {address.postalCode}
                            </section>
                            <section className="mb-2">
                              <i className="fa fa-user-tag mx-1"></i>
                              گیرنده :{address.receiverName}
                            </section>
                            <section className="mb-2">
                              <i className="fa fa-mobile-alt mx-1"></i>
                              موبایل گیرنده : {address.receiverPhone}
                            </section>
                            <a className="" href="#">
                              <i className="fa fa-edit"></i> ویرایش آدرس
                            </a>
                          </section>
                        );
                      })}
              </section>
            </section>
          </main>
        </section>
      </section>
    </section>
  );
};

export default myAddresses;
