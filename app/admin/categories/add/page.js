"use client";
import Header from "@/app/components/ui/Header";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import Sidebar from "@/app/components/ui/Sidebar";
import useAuth from "@/app/hooks/use-auth";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";

const AddCategory = () => {
  const { isLoggedIn, isAdmin } = useAuth();

  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const validateForm = () => {
    if (name.trim() === "") {
      setFormError("نام دسته بندی الزامی می باشد ");
      return false;
    } else if (name.trim().length < 3 || name.trim().length > 30) {
      setFormError("نام دسته بندی باید بین ۳ تا ۳۰ باشد");
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
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await response.json();
      if (response.status === 400) {
        setFormError(data.message);
        return;
      }
      if (!response.ok) {
        throw new Error("مشکلی در ساخت دسته بندی پیش آمده است");
      }
      router.push("/admin/categories");
    } catch (error) {
      setError(error.message);
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
            <h2 className="my-4">افزودن دسته بندی جدید </h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {formError && <Alert variant="warning">{formError}</Alert>}
            {loading ? (
              <LoadingSpinner />
            ) : (
              <>
                <Form onSubmit={handleSubmit}>
                  <Form.Group>
                    <Form.Label>نام دسته بندی</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="نام دسته بندی ..."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Form.Group>
                  <Button type=" submit"> ذخیره</Button>
                </Form>
              </>
            )}
          </main>
        </Col>
      </Row>
    </Container>
  );
};

export default AddCategory;
