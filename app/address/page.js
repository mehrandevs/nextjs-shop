"use client";
import React, { useEffect, useState } from "react";
import "../styles/address.css";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
const Address = () => {
  const { cart, loading } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [loadingAddress, setLoadingAddress] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const items = cart?.items ?? [];
  console.log(addresses);

  const itemsTotal = items.reduce(
    (sum, i) => sum + (i.product?.price ?? 0) * i.quantity,
    0,
  );
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await fetch("/api/address");
        if (!res.ok) {
          throw new Error("خطا در دریفات ادرس ها");
        }
        const data = await res.json();
        setAddresses(data.addresses ?? []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingAddress(false);
      }
    };
    fetchAddresses();
  }, []);
  const handleAddAddress = async () => {
    setSubmitting(true);

    try {
      const res = await fetch("/api/cart", {
        method: "PUT",
        body: JSON.stringify({ addressId: selectedAddressId }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "مشکلی در ثبت آدرس پیش آمده است");
        return;
      }
      toast.success(data.message || "ثبت شد");
      router.push("/checkout");
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <main id="main-body-one-col" className="main-body">
      <section className="mb-4">
        <section className="container-xxl">
          <section className="row">
            <section className="col">
              <section className="content-header">
                <section className="d-flex justify-content-between align-items-center">
                  <h2 className="content-header-title">
                    <span>
                      تکمیل اطلاعات ارسال کالا (آدرس گیرنده، مشخصات گیرنده، نحوه
                      ارسال){" "}
                    </span>
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
                          انتخاب آدرس و مشخصات گیرنده
                        </h2>
                        <section className="content-header-link">
                          {/* <!--<a href="#">مشاهده همه</a>--> */}
                        </section>
                      </section>
                    </section>

                    <section
                      className="address-alert alert alert-primary d-flex align-items-center p-2"
                      role="alert"
                    >
                      <i className="fa fa-info-circle flex-shrink-0 me-2"></i>
                      <section>پس از ایجاد آدرس، آدرس را انتخاب کنید.</section>
                    </section>

                    <section className="address-select">
                      {loadingAddress && <p>در حال دریافت آدرس‌ها...</p>}

                      {!loadingAddress && addresses.length === 0 && (
                        <p className="text-muted">
                          هنوز آدرسی ثبت نکرده‌اید. یک آدرس جدید اضافه کنید.
                        </p>
                      )}

                      {addresses.map((address) => {
                        return (
                          <React.Fragment key={address._id}>
                            <input
                              type="radio"
                              name="address"
                              value={address._id}
                              id={"a" + address._id}
                              checked={selectedAddressId === address._id}
                              onChange={() => setSelectedAddressId(address._id)}
                            />
                            <label
                              htmlFor={"a" + address._id}
                              className="address-wrapper mb-2 p-2"
                            >
                              <section className="mb-2">
                                <i className="fa fa-map-marker-alt mx-1"></i>
                                آدرس : {address.address}
                              </section>
                              <section className="mb-2">
                                <i className="fa fa-user-tag mx-1"></i>
                                گیرنده : {address.receiverName}
                              </section>
                              <section className="mb-2">
                                <i className="fa fa-mobile-alt mx-1"></i>
                                موبایل گیرنده : {address.receiverPhone}
                              </section>

                              <span className="address-selected">
                                کالاها به این آدرس ارسال می شوند
                              </span>
                            </label>
                          </React.Fragment>
                        );
                      })}
                    </section>
                  </section>
                </section>
                <section className="col-md-3">
                  <section className="content-wrapper bg-white p-3 rounded-2 cart-total-price">
                    <section className="d-flex justify-content-between align-items-center">
                      <p className="text-muted">قیمت کالاها</p>
                      <p className="text-muted">
                        {itemsTotal.toLocaleString()}
                        تومان
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
                      <p className="text-muted">جمع سبد خرید</p>
                      <p className="fw-bolder">
                        {loading
                          ? "0"
                          : (
                              cart?.shippingCost + itemsTotal
                            )?.toLocaleString()}{" "}
                        تومان
                      </p>
                    </section>

                    <section className="border-bottom mb-3"></section>

                    <p className="my-3">
                      <i className="fa fa-info-circle me-1"></i> کاربر گرامی
                      کالاها بر اساس نوع ارسالی که انتخاب می کنید در مدت زمان
                      ذکر شده ارسال می شود.
                    </p>

                    <section className="border-bottom mb-3"></section>

                    <section className="d-flex justify-content-between align-items-center">
                      <p className="text-muted">مبلغ قابل پرداخت</p>
                      <p className="fw-bold">
                        {loading
                          ? "0"
                          : (
                              cart?.shippingCost + itemsTotal
                            )?.toLocaleString()}{" "}
                        تومان
                      </p>
                    </section>

                    <section>
                      {selectedAddressId ? (
                        <button
                          type="button"
                          className={`btn btn-danger w-100 `}
                          onClick={handleAddAddress}
                          disabled={submitting}
                        >
                          {submitting ? "در حال ثبت..." : "ادامه فرآیند خرید"}
                        </button>
                      ) : (
                        <section className="text-warning border border-warning text-center py-2 rounded-2 d-block">
                          آدرس را انتخاب کن
                        </section>
                      )}
                    </section>
                  </section>
                </section>
              </section>
            </section>
          </section>
        </section>
      </section>
    </main>
  );
};

export default Address;
