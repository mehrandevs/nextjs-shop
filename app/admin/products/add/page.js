"use client";
import Header from "@/app/components/ui/Header";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import Sidebar from "@/app/components/ui/Sidebar";
import useAuth from "@/app/hooks/use-auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";

const AddProduct = () => {
  const { isLoggedIn, isAdmin } = useAuth();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const formatPrice = (value) => {
    value = String(value ?? "");

    const englishNumber = value.replace(/[۰-۹]/g, (d) =>
      "۰۱۲۳۴۵۶۷۸۹".indexOf(d),
    );

    const digits = englishNumber.replace(/\D/g, "");

    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  const [stock, setStock] = useState(0);
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      })
      .catch(() => {
        setError("مشکلی در دریافت دسته بندی ها رخ داده است ");
      });
  }, []);

  const validateForm = () => {
    if (!name || name.trim() === "") {
      setFormError("نام محصول الزامی می باشد ");
      return false;
    } else if (name.trim().length < 3 || name.trim().length > 30) {
      setFormError("نام محصول باید بین ۳ تا ۳۰ باشد");
      return false;
    }

    if (!description || description.trim() === "") {
      setFormError("توضیحات محصول الزامی می باشد ");
      return false;
    } else if (
      description.trim().length < 3 ||
      description.trim().length > 500
    ) {
      setFormError("توضیحات محصول باید بین ۳ تا ۲۰۰ باشد");
      return false;
    }

    if (price <= 0) {
      setFormError("قیمت محصول باید یک مقدار مثبت باشد ");
      return false;
    }
    if (!category) {
      setFormError("دسته بندی محصول باید باشد ");
      return false;
    }
    if (!image) {
      setFormError("انتخاب تصویر الزامی می باشد");
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
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("category", category);
      formData.append("image", image);

      setLoading(true);
      const response = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.status === 400) {
        setFormError(data.message);
        return;
      }
      if (!response.ok) {
        throw new Error("مشکلی در ساخت محصول پیش آمده است");
      }
      router.push("/admin/products");
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
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>نام محصول</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="نام محصول را وارد کنید..."
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>دسته‌بندی</Form.Label>
                        <Form.Select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                        >
                          <option value="">انتخاب دسته‌بندی</option>

                          {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                              {cat.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>توضیحات</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      placeholder="توضیحات محصول..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>قیمت (تومان)</Form.Label>
                        <Form.Control
                          type="text"
                          inputMode="numeric"
                          placeholder="مثلاً 250,000"
                          value={formatPrice(price)}
                          onChange={(e) => {
                            const value = e.target.value
                              .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d))
                              .replace(/\D/g, "");

                            setPrice(value);
                          }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>موجودی</Form.Label>
                        <Form.Control
                          type="text"
                          inputMode="numeric"
                          placeholder="مثلاً 20"
                          value={stock}
                          onChange={(e) => {
                            const value = e.target.value
                              .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d))
                              .replace(/\D/g, "");

                            setStock(value);
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label>تصویر محصول</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files[0])}
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-end gap-2">
                    <Button variant="outline-secondary" type="button">
                      انصراف
                    </Button>

                    <Button variant="primary" type="submit">
                      ذخیره محصول
                    </Button>
                  </div>
                </Form>
              </>
            )}
          </main>
        </Col>
      </Row>
    </Container>
  );
};

export default AddProduct;
