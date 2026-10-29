"use client";

import SidebarPanel from "@/app/components/ui/SidebarPanel";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Alert } from "react-bootstrap";
import { toast } from "react-toastify";

const addAddress = () => {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [errorForm, setErrorForm] = useState({});
  const router = useRouter();

  const onlyDigits = (value) =>
    value.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d)).replace(/\D/g, "");

  const validate = () => {
    const newErrors = {};

    if (!address.trim()) newErrors.address = "آدرس را وارد کنید";
    else if (address.trim().length < 10)
      newErrors.address = "آدرس باید حداقل ۱۰ کاراکتر باشد";

    if (!postalCode) newErrors.postalCode = "کد پستی را وارد کنید";
    else if (!/^\d{10}$/.test(postalCode))
      newErrors.postalCode = "کد پستی باید ۱۰ رقم باشد";

    if (!receiverName.trim())
      newErrors.receiverName = "نام گیرنده را وارد کنید";

    if (!receiverPhone) newErrors.receiverPhone = "شماره تماس را وارد کنید";
    else if (!/^09\d{9}$/.test(receiverPhone))
      newErrors.receiverPhone = "شماره موبایل معتبر نیست (مثال: 09123456789)";

    setErrorForm(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: address.trim(),
          postalCode: Number(postalCode),
          receiverName: receiverName.trim(),
          receiverPhone,
        }),
      });

      if (!res.ok) {
        setError("خطا در ثبت آدرس");
        return;
      }
      toast.success("ادرس با موفقیت ساخته شد ");
      router.push("/panel/my-addresses");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
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
                  <section className="content-header-link"></section>
                </section>
              </section>

              <section className="my-addresses">
                {error && <Alert variant="danger">{error}</Alert>}
                <form onSubmit={handleSubmit} className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="receiverName" className="form-label">
                      نام گیرنده
                    </label>
                    <input
                      id="receiverName"
                      placeholder="مثلاً: مهران احمدی"
                      type="text"
                      className={`form-control ${errorForm.receiverName ? "is-invalid" : ""}`}
                      value={receiverName}
                      onChange={(e) => setReceiverName(e.target.value)}
                    />
                    {errorForm.receiverName && (
                      <div className="invalid-feedback">
                        {errorForm.receiverName}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="receiverPhone" className="form-label">
                      شماره موبایل گیرنده
                    </label>
                    <input
                      id="receiverPhone"
                      type="tel"
                      inputMode="numeric"
                      dir="ltr"
                      className={`form-control text-end ${errorForm.receiverPhone ? "is-invalid" : ""}`}
                      placeholder="09123456789"
                      value={receiverPhone}
                      onChange={(e) =>
                        setReceiverPhone(onlyDigits(e.target.value))
                      }
                      maxLength={11}
                    />
                    {errorForm.receiverPhone && (
                      <div className="invalid-feedback">
                        {errorForm.receiverPhone}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="postalCode" className="form-label">
                      کد پستی
                    </label>
                    <input
                      id="postalCode"
                      type="text"
                      inputMode="numeric"
                      dir="ltr"
                      className={`form-control text-end ${errorForm.postalCode ? "is-invalid" : ""}`}
                      placeholder="1234567890"
                      value={postalCode}
                      onChange={(e) =>
                        setPostalCode(onlyDigits(e.target.value))
                      }
                      maxLength={10}
                    />
                    {errorForm.postalCode && (
                      <div className="invalid-feedback">
                        {errorForm.postalCode}
                      </div>
                    )}
                  </div>

                  <div className="col-12">
                    <label htmlFor="address" className="form-label">
                      آدرس
                    </label>
                    <textarea
                      id="address"
                      rows={3}
                      className={`form-control ${errorForm.address ? "is-invalid" : ""}`}
                      value={address}
                      placeholder="استان، شهر، خیابان، کوچه، پلاک، واحد"
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                    {errorForm.address && (
                      <div className="invalid-feedback">
                        {errorForm.address}
                      </div>
                    )}
                  </div>

                  <div className="col-12 text-end">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      ثبت آدرس
                    </button>
                  </div>
                </form>
              </section>
            </section>
          </main>
        </section>
      </section>
    </section>
  );
};

export default addAddress;
