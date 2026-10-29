"use client";
import Header from "@/app/components/ui/Header";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import Sidebar from "@/app/components/ui/Sidebar";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import useAuth from "@/app/hooks/use-auth";
import { toast } from "react-toastify";
const AddDiscount = () => {
  let today = new Date();
  const { isLoggedIn, isAdmin } = useAuth();
  const [code, setCode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [expirationDate, setExpirationDate] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const validateForm = () => {
    if (code.trim() === "") {
      setFormError("کد تخفیف الزامی می باشد ");
      return false;
    } else if (code.trim().length < 3 || code.trim().length > 20) {
      setFormError("کد تخفیف باید بین ۳ تا ۲۰ کاراکتر باشد");
      return false;
    } else if (!/^[A-Za-z0-9]+$/.test(code.trim())) {
      setFormError("کد تخفیف فقط می‌تواند شامل حروف انگلیسی و اعداد باشد");
      return false;
    }
    if (discountPercentage === "") {
      setFormError("درصد تخفیف الزامی می باشد ");
      return false;
    } else if (discountPercentage < 1 || discountPercentage > 100) {
      setFormError("درصد تخفیف باید بین ۱ تا ۱۰۰ باشد");
      return false;
    }
    if (!expirationDate) {
      setFormError("تاریخ انقضا الزامی می‌باشد");
      return false;
    }
    const selectedDate = expirationDate.toDate();

    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setFormError("تاریخ انقضا نمی‌تواند قبل از امروز باشد");
      return false;
    }

    setFormError("");
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    if (!isLoggedIn) return toast.error("شما وارد نشده‌اید");
    if (!isAdmin) return toast.error("دسترسی ندارید");

    try {
      setLoading(true);
      const response = await fetch("/api/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          discountPercentage: Number(discountPercentage),
          expirationDate: expirationDate.toDate(),
          isActive,
        }),
      });
      const data = await response.json();
      if (response.status === 400) {
        setFormError(data.message);
        return;
      }
      if (!response.ok) {
        throw new Error("مشکلی در ساخت کد تخفیف پیش آمده است");
      }
      router.push("/admin/discounts");
    } catch (error) {
      setError("مشکلی در ارتباط با سرور پیش آمده است");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        <Col md={2} className=" d-none d-md-block">
          <Sidebar />
        </Col>
        <Col sm={12} md={10}>
          <Header />
          <main className="content p-4 h-100 ">
            {" "}
            <h2 className="my-4">افزودن کد تخفیف جدید </h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {formError && <Alert variant="warning">{formError}</Alert>}
            {loading ? (
              <LoadingSpinner />
            ) : (
              <>
                <div className="bg-white rounded-3 shadow-sm p-4">
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label className="fw-semibold">
                            کد تخفیف
                          </Form.Label>

                          <Form.Control
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="مثلاً MEHRAN20"
                            className="py-2"
                          />

                          <Form.Text className="text-muted">
                            کد تخفیف را به صورت انگلیسی وارد کنید.
                          </Form.Text>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label className="fw-semibold">
                            درصد تخفیف
                          </Form.Label>

                          <div className="input-group">
                            <Form.Control
                              type="number"
                              // min="1"
                              // max="100"
                              value={discountPercentage}
                              onChange={(e) =>
                                setDiscountPercentage(e.target.value)
                              }
                              placeholder="مثلاً 20"
                              className="py-2"
                            />

                            <span className="input-group-text">٪</span>
                          </div>

                          <Form.Text className="text-muted">
                            مقدار تخفیف باید بین ۱ تا ۱۰۰ درصد باشد.
                          </Form.Text>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label className="fw-semibold">
                            تاریخ انقضا
                          </Form.Label>

                          <DatePicker
                            calendar={persian}
                            locale={persian_fa}
                            value={expirationDate}
                            onChange={setExpirationDate}
                            calendarPosition="bottom-right"
                            format="YYYY/MM/DD"
                            inputClass="form-control py-2"
                            containerClassName="w-100"
                          />

                          <Form.Text className="text-muted">
                            تاریخ پایان اعتبار کد تخفیف را انتخاب کنید.
                          </Form.Text>
                        </Form.Group>
                      </Col>
                      <Col md={6} className="d-flex align-items-center">
                        <Form.Group>
                          <Form.Label className="fw-semibold">فعال </Form.Label>
                          <input
                            type="checkbox"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            className="mx-2"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <hr className="my-4" />

                    <div className="d-flex justify-content-end gap-2">
                      <Button
                        type="button"
                        variant="light"
                        className="px-4 border"
                        onClick={() => window.history.back()}
                      >
                        انصراف
                      </Button>

                      <Button type="submit" variant="dark" className="px-4">
                        ذخیره کد تخفیف
                      </Button>
                    </div>
                  </Form>
                </div>
              </>
            )}
          </main>
        </Col>
      </Row>
    </Container>
  );
};

export default AddDiscount;
