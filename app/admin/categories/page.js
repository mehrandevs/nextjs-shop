"use client";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import Sidebar from "@/app/components/ui/Sidebar";
import Header from "@/app/components/ui/Header";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import GeneralError from "@/app/components/ui/GeneralError";
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from "react-icons/ai";
import Link from "next/link";
import useAuth from "@/app/hooks/use-auth";
import { toast } from "react-toastify";

const Categories = () => {
  const { isLoggedIn, isAdmin } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories", {
          method: "GET",
        });
        if (!response.ok) {
          setError(response.message);
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        setError(data.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("آیا از حذف این دسته‌بندی مطمئن هستید؟");
    if (!confirmed) return;
    if (!isLoggedIn) return toast.error("شما وارد نشده‌اید");
    if (!isAdmin) return toast.error("دسترسی ندارید");
    try {
      setLoading(true);
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (response.status === 400) {
        setError(data.message);
        return;
      }
      setCategories(categories.filter((category) => category._id !== id));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        <Col md={2} className="d-none d-md-block">
          <Sidebar />
        </Col>
        <Col sm={12} md={10}>
          <Header />
          <main className="content p-4 h-100">
            <h4 className="my-4">مدیریت دسته‌بندی‌ها</h4>
            {error && <GeneralError error={error} />}
            {loading ? (
              <LoadingSpinner />
            ) : (
              <>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <Button
                    as={Link}
                    href="/admin/categories/add"
                    className="d-flex align-items-center gap-2"
                  >
                    <AiOutlinePlus />
                    افزودن دسته‌بندی
                  </Button>
                </div>

                <div className="table-responsive shadow-sm rounded-3 overflow-hidden bg-white">
                  <Table hover className="align-middle text-center mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th>#</th>
                        <th>نام دسته‌بندی</th>
                        <th>عملیات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((category, index) => (
                        <tr key={category._id}>
                          <td>{index + 1}</td>
                          <td className="fw-semibold">{category.name}</td>
                          <td>
                            <div className="d-flex justify-content-center gap-2">
                              <Link
                                href={`/admin/categories/edit/${category._id}`}
                                className="btn btn-outline-warning btn-sm"
                                aria-label="ویرایش"
                                title="ویرایش"
                              >
                                <AiOutlineEdit size={18} />
                              </Link>
                              <button
                                onClick={() => handleDelete(category._id)}
                                className="btn btn-outline-danger btn-sm"
                                aria-label="حذف"
                                title="حذف"
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

export default Categories;
