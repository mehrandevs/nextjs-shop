"use client";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import Sidebar from "@/app/components/ui/Sidebar";
import Header from "@/app/components/ui/Header";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import GeneralError from "@/app/components/ui/GeneralError";
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from "react-icons/ai";
import Link from "next/link";
import Image from "next/image";
import crypto from "crypto";
import { toast } from "react-toastify";
import useAuth from "@/app/hooks/use-auth";

const Products = () => {
  const { isLoggedIn, isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          setProducts([]);
          return;
        }
        setProducts(data);
      } catch (error) {
        setError(data.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(
      `آیا از حذف  محصول <${name}> مطمئن هستید؟`,
    );
    if (!confirmed) return;
    if (!isLoggedIn) return toast.error("شما وارد نشده‌اید");
    if (!isAdmin) return toast.error("دسترسی ندارید");
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts(products.filter((product) => product._id !== id));
        toast.success(`محصول: ${name} با موفقیت حذف شد `);
      } else {
        const data = await response.json();
        setError(data.message || "خطا در حذف محصول");
      }
    } catch (error) {
      console.log(error);
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
            <h4 className="my-4">مدیریت محصول ها </h4>
            {error && <GeneralError error={error} />}
            {loading ? (
              <LoadingSpinner />
            ) : (
              <>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <Link
                    href="/admin/products/add"
                    className="btn btn-primary d-flex align-items-center gap-2"
                  >
                    <AiOutlinePlus />
                    افزودن محصول
                  </Link>
                </div>

                <div className="table-responsive shadow-sm rounded-3">
                  <Table hover className="align-middle mb-0">
                    <thead className="table-dark">
                      <tr className="text-center">
                        <th>#</th>
                        <th>تصویر</th>
                        <th>نام محصول</th>
                        <th>دسته‌بندی</th>
                        <th>موجودی</th>
                        <th>قیمت</th>
                        <th>توضیحات</th>
                        <th>عملیات</th>
                      </tr>
                    </thead>

                    <tbody>
                      {products.map((product, index) => (
                        <tr key={product._id}>
                          <td className="text-center">{index + 1}</td>

                          <td className="text-center">
                            <Image
                              src={product.imageUrl}
                              alt={"fsd"}
                              width={70}
                              height={70}
                              className="rounded object-fit-cover border"
                            />
                          </td>

                          <td className="fw-semibold">{product.name}</td>

                          <td>{product.category?.name ?? "-"}</td>

                          <td className="text-center">
                            <span
                              className={`badge ${
                                product.stock > 0 ? "bg-success" : "bg-danger"
                              }`}
                            >
                              {product.stock}
                            </span>
                          </td>

                          <td>
                            {Number(product.price).toLocaleString()} تومان
                          </td>

                          <td style={{ maxWidth: 250 }}>
                            {product.description.length > 40
                              ? product.description.slice(0, 40) + "..."
                              : product.description}
                          </td>

                          <td>
                            <div className="d-flex justify-content-center gap-2">
                              <Link
                                href={`/admin/products/edit/${product._id}`}
                                className="btn btn-warning btn-sm"
                              >
                                <AiOutlineEdit size={18} />
                              </Link>

                              <button
                                onClick={() =>
                                  handleDelete(product._id, product.name)
                                }
                                className="btn btn-danger btn-sm"
                              >
                                <AiOutlineDelete size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </>
            )}
          </main>
        </Col>
      </Row>
    </Container>
  );
};

export default Products;
