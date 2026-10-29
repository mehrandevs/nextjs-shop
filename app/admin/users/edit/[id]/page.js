"use client";
import Header from "@/app/components/ui/Header";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import Sidebar from "@/app/components/ui/Sidebar";
import useAuth from "@/app/hooks/use-auth";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";
const UpdateUser = () => {
  const { isLoggedIn, isAdmin } = useAuth();
  const { id } = useParams();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [adminStatus, setAdminStatus] = useState(false);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      fetch(`/api/users/${id}`)
        .then((response) => response.json())
        .then((body) => {
          setName(body.name);
          setPhone(body.phone);
          setAdminStatus(body.isAdmin);
        });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [id]);

  const validateForm = () => {
    if (!name || name.trim().length < 3 || name.trim().length > 30) {
      setError("نام و نام خانوادگی باید بین۳ تا ۳۰. کاراکتر باشد");
      return;
    }
    const phoneRegex = /^(\+98|0)?9\d{9}$/;
    if (!phone || !phoneRegex.test(phone)) {
      setError("شماره تلفن وارد شده صحیح نیست");
      return;
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
      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          isAdmin: adminStatus,
        }),
      });
      const data = await response.json();
      if (response.status === 400) {
        setFormError(data.message);
        return;
      }
      if (!response.ok) {
        throw new Error("مشکلی در ویرایش کاربر پیش آمده است");
      }
      toast.success(data.message || "کاربر  با موفقیت ویرایش شد ", {
        position: "top-center",
      });
      router.push("/admin/users");
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
            <h2 className="my-4">ویرایش کاربر </h2>
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
                            نام و نام خانوادگی
                          </Form.Label>

                          <Form.Control
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="py-2"
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label className="fw-semibold">
                            شماره تلفن
                          </Form.Label>

                          <div className="input-group">
                            <Form.Control
                              type="text"
                              placeholder="شماره تلفن"
                              value={phone}
                              onChange={(e) => {
                                const value = e.target.value
                                  .replace(/[۰-۹]/g, (d) =>
                                    "۰۱۲۳۴۵۶۷۸۹".indexOf(d),
                                  )
                                  .replace(/\D/g, "");

                                setPhone(value);
                              }}
                            />
                          </div>
                        </Form.Group>
                      </Col>

                      <Col md={6} className="d-flex align-items-center">
                        <Form.Group>
                          <Form.Label className="fw-semibold">
                            ادمین{" "}
                          </Form.Label>
                          <input
                            type="checkbox"
                            checked={adminStatus}
                            onChange={(e) => setAdminStatus(e.target.checked)}
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
                        ذخیره کاربر
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

export default UpdateUser;
