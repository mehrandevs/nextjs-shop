"use client";
import Header from "@/app/components/ui/Header";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import Sidebar from "@/app/components/ui/Sidebar";
import useAuth from "@/app/hooks/use-auth";
import React, { useEffect, useState } from "react";
import { Alert, Col, Container, Form, Row, Table } from "react-bootstrap";
import { toast } from "react-toastify";

const Stack = () => {
  const { isLoggedIn, isAdmin } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products", {
          method: "GET",
        });
        const data = await response.json();

        if (response.status === 500) {
          setError(data.message);
          setProducts([]);
          return;
        }

        if (data.length === 0) {
          setError("هیچ محصولی وجود ندارد");
          return;
        }
        setProducts(
          data.map((product) => ({
            ...product,
            prevStock: product.stock,
          })),
        );
      } catch (error) {
        setError("خطا در دریافت محصولات");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  const handleStock = (e, id) => {
    const newStock = Number(e.target.value);

    setProducts((prevProducts) =>
      prevProducts.map((item) =>
        item._id === id ? { ...item, stock: newStock } : item,
      ),
    );
  };

  const handleSave = async (id, name) => {
    const product = products.find((item) => item._id === id);
    setError(null);

    if (!product) {
      console.error("محصول پیدا نشد");
      return;
    }
    if (product.stock === product.prevStock) {
      setError("هیچ مقداری تغیر نکرده است");
      return;
    }
    if (!isLoggedIn) return toast.error("شما وارد نشده‌اید");
    if (!isAdmin) return toast.error("دسترسی ندارید");

    try {
      setSavingId(id);
      const response = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stock: product.stock }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "مشکلی در ویرایش محصول پیش آمده است");
      }

      toast.success(
        `موجودی محصول «${name}» از ${product.prevStock} به ${product.stock} تغییر یافت.`,
        {
          position: "top-center",
        },
      );

      setProducts((prevProducts) =>
        prevProducts.map((item) =>
          item._id === id
            ? {
                ...item,
                prevStock: item.stock,
              }
            : item,
        ),
      );
    } catch (error) {
      setError("مشکلی در ارتباط با سرور پیش آمده است");
    } finally {
      setSavingId(null);
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
            <h4 className="my-4">مدیرت انبار</h4>
            {error && <Alert variant="danger">{error}</Alert>}
            {loading ? (
              <LoadingSpinner />
            ) : (
              <>
                <Table hover className="align-right  mb-0">
                  <thead className="table-dark">
                    <tr className="text-start ">
                      <th>شناسه</th>
                      <th>نام محصول</th>
                      <th>موجودی</th>
                      <th>عملیات</th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.map((product, index) => (
                      <tr key={product._id}>
                        <td className=" text-start">{index + 1}</td>

                        <td className="fw-semibold">{product.name}</td>
                        <td className="text-start">
                          <Form.Control
                            type="number"
                            min={0}
                            max={100}
                            inputMode="numeric"
                            placeholder="مثلاً 20"
                            onChange={(e) => handleStock(e, product._id)}
                            value={product.stock}
                          />
                        </td>

                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <button
                              onClick={() =>
                                handleSave(product._id, product.name)
                              }
                              className="btn btn-primary btn-sm"
                              disabled={
                                product.stock === product.prevStock ||
                                savingId === product._id
                              }
                            >
                              {savingId === product._id
                                ? "در حال ذخیره..."
                                : "ذخیره"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            )}
          </main>
        </Col>
      </Row>
    </Container>
  );
};

export default Stack;
