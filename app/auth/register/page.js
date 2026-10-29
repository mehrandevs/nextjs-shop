"use client";
import NoAuthWrapper from "@/app/components/auth/NoAuthWrapper";
import Link from "next/link";
import { signIn } from "next-auth/react";
import "../../styles/login.css";

import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
} from "react-bootstrap";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";

const Register = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpExpiresAt, setOtpExpiresAt] = useState(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [step, setStep] = useState(1);

  const router = useRouter();

  useEffect(() => {
    if (!otpExpiresAt) return;

    const updateTimer = () => {
      const diff = Math.floor((otpExpiresAt - new Date()) / 1000);
      setRemainingSeconds(Math.max(diff, 0));
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [otpExpiresAt]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || name.trim().length < 3 || name.trim().length > 30) {
      setError("نام و نام خانوادگی باید بین۳ تا ۳۰. کاراکتر باشد");
      return;
    }
    const phoneRegex = /^(\+98|0)?9\d{9}$/;
    if (!phone || !phoneRegex.test(phone)) {
      setError("شماره تلفن وارد شده صحیح نیست");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone, type: "register" }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "خطای از سمت سرور پیش آمده است");
      } else {
        setSuccess("کد تایید برای شما ارسال شد ");
        setOtpExpiresAt(new Date(data.expiresAt));
        setStep(2);
      }
      console.log(data);
      toast.warning(`کد ورود جهت برسی ${data.otpCode}`, { autoClose: 40000 });
    } catch (error) {
      setError("مشکلی در ارتباط با سرور پیش آمده است");
    } finally {
      setLoading(false);
    }
  };
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otp || otp.length !== 6) {
      setError("کد تایید باید ۶ رقم باشد");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone, code: otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "خطای از سمت سرور پیش آمده است");
        setLoading(false);
        return;
      }

      const result = await signIn("credentials", {
        phone,
        code: otp,
        redirect: false,
      });

      if (!result.ok) {
        router.push(
          "/auth/login?message=ثبت‌نام با موفقیت انجام شد، لطفا وارد شوید",
        );
      } else {
        toast.success("ثبت‌ نام و ورود با موفقیت انجام شد", {
          position: "top-right",
        });
        router.push("/");
      }
    } catch (error) {
      setError("مشکلی در ارتباط با سرور پیش آمده است");
    } finally {
      setLoading(false);
    }
  };
  return (
    <NoAuthWrapper>
      <section className="vh-100 d-flex justify-content-center flex-column align-items-center pb-5">
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <section className="login-wrapper mb-5">
          <Link href={"/"} className="login-logo">
            <img src="/images/logo/4.png" alt="" />
          </Link>
          <section className="login-title"> ثبت نام در سایت</section>
          {/* <section className="login-info">
            شماره موبایل خود را وارد کنید
          </section> */}
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {step === 1 && (
                <Form onSubmit={handleSendOtp}>
                  <Form.Group className="login-input-text">
                    <Form.Label>نام و نام خانوادگی</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="نام و نام خانوادگی"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="login-btn d-grid g-2">
                    <Form.Label>شماره تلفن</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="شماره تلفن"
                      value={phone}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d))
                          .replace(/\D/g, "");

                        setPhone(value);
                      }}
                    />
                  </Form.Group>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-100"
                    variant="danger"
                  >
                    {loading ? "در حال ثبت نام" : "ثبت نام"}
                  </Button>
                </Form>
              )}
              {step === 2 && (
                <>
                  <Form onSubmit={handleVerifyOtp}>
                    {remainingSeconds > 0 ? (
                      <span
                        className="badge"
                        style={{
                          backgroundColor:
                            remainingSeconds <= 20 ? "#dc3545" : "#198754",
                          fontSize: "0.85rem",
                          padding: "6px 12px",
                          borderRadius: "20px",
                        }}
                      >
                        {Math.floor(remainingSeconds / 60)}:
                        {String(remainingSeconds % 60).padStart(2, "0")}
                      </span>
                    ) : (
                      <span
                        className="badge bg-secondary"
                        style={{
                          fontSize: "0.85rem",
                          padding: "6px 12px",
                          borderRadius: "20px",
                        }}
                      >
                        منقضی شده
                      </span>
                    )}
                    <Form.Group className="login-input-text">
                      <Form.Label>کد تایید</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="۱۲۳۴۵۶"
                        value={otp}
                        onChange={(e) => {
                          const value = e.target.value
                            .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d))
                            .replace(/\D/g, "")
                            .slice(0, 6);

                          setOtp(value);
                        }}
                      />
                    </Form.Group>
                    <Form.Group className="login-btn d-grid g-2">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-100"
                      >
                        {loading ? "در حال تایید" : "تایید کد"}
                      </Button>
                      {remainingSeconds === 0 && (
                        <Button
                          variant="link"
                          className="p-0 "
                          onClick={handleSendOtp}
                        >
                          ارسال مجدد کد
                        </Button>
                      )}
                    </Form.Group>
                  </Form>
                  <section className="login-terms-and-conditions">
                    <Link href={"/auth/login"}>ورود به سایت </Link>
                  </section>
                </>
              )}
            </>
          )}
        </section>
      </section>
    </NoAuthWrapper>
  );
};

export default Register;
