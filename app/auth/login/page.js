"use client";
import NoAuthWrapper from "@/app/components/auth/NoAuthWrapper";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import "../../styles/login.css";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
} from "react-bootstrap";
import { toast } from "react-toastify";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpExpiresAt, setOtpExpiresAt] = useState(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [step, setStep] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const message = searchParams.get("message");
    if (message) {
      setSuccess(message);
    }
  }, [searchParams]);

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
        body: JSON.stringify({ phone, type: "login" }),
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
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otp || otp.length !== 6) {
      setError("کد تایید باید ۶ رقم باشد");
      return;
    }

    setLoading(true);

    const result = await signIn("credentials", {
      phone,
      code: otp,
      redirect: false,
    });

    if (!result.ok) {
      setError(result.error || "خطای رخ داده است ");
    } else {
      toast.success(" ورود با موفقیت انجام شد", {
        position: "top-right",
      });
      router.push("/");
    }

    setLoading(false);
  };
  return (
    <NoAuthWrapper>
      <div style={{ backgroundColor: "#f9f9f9" }}>
        <section className="vh-100 d-flex justify-content-center flex-column align-items-center pb-5">
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <section className="login-wrapper mb-5">
            <Link href={"/"} className="login-logo">
              <img src="/images/logo/4.png" alt="" />
            </Link>
            <section className="login-title">ورود به سایت </section>
            <section className="login-info">
              شماره موبایل خود را وارد کنید
            </section>
            {loading ? (
              <LoadingSpinner />
            ) : (
              <>
                {step === 1 && (
                  <>
                    <Form onSubmit={handleSendOtp} className=" mb-3">
                      <Form.Group className="login-input-text">
                        {/* <Form.Label>شماره تلفن</Form.Label> */}
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
                      <Form.Group className="login-btn d-grid g-2">
                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-100"
                          variant="danger"
                        >
                          {loading ? "در حال ورود " : "ورود "}
                        </Button>
                      </Form.Group>
                    </Form>
                    <section className="login-terms-and-conditions">
                      <Link href={"/auth/register"}>ثبت نام</Link>
                    </section>
                  </>
                )}
                {step === 2 && (
                  <>
                    <Form onSubmit={handleLogin}>
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
                      <Link href={"/auth/register"}>ثبت نام</Link>
                    </section>
                  </>
                )}
              </>
            )}
          </section>
        </section>
      </div>
    </NoAuthWrapper>
  );
};

export default Login;
