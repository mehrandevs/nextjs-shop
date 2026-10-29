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

const Discount = () => {
  const { isLoggedIn, isAdmin } = useAuth();
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await fetch(`/api/discounts`, {
          method: "GET",
        });
        const data = await response.json();
        if (!response.ok) {
          setError(data.message || "خطا در دریافت کد‌های تخفیف");
          return;
        }
        setDiscounts(data);
      } catch (error) {
        setError("مشکلی در ارتباط با سرور پیش آمده است");
      } finally {
        setLoading(false);
      }
    };
    fetchDiscounts();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("آیا از حذف این کد تخفیف مطمئن هستید؟");
    if (!confirmed) return;
    if (!isLoggedIn) return toast.error("شما وارد نشده‌اید");
    if (!isAdmin) return toast.error("دسترسی ندارید");

    try {
      setLoading(true);
      const response = await fetch(`/api/discounts/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDiscounts(discounts.filter((discount) => discount._id !== id));
        setError("");
      } else {
        const data = await response.json();
        setError(data.message || "خطا در حذف کد تخفیف");
      }
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
            <h4 className="my-4">مدیرت کد های تخفیف</h4>
            {error && <GeneralError error={error} />}
            {loading ? (
              <LoadingSpinner />
            ) : (
              <>
                <Link
                  href="discounts/add"
                  className="btn-custom-add px-3 py-2 rounded-2 mb-3"
                >
                  افزودن
                  <AiOutlinePlus />
                </Link>
                <Table hover className="align-middle mb-0">
                  <thead className="table-dark">
                    <tr className="text-center">
                      <th>شناسه</th>
                      <th>کد تخفیف</th>
                      <th>درصد تخفیف</th>
                      <th>تاریخ انقضا</th>
                      <th>وضعیت</th>
                      <th>عملیات</th>
                    </tr>
                  </thead>

                  <tbody>
                    {discounts.map((discount, index) => (
                      <tr key={discount._id}>
                        <td className="text-center">{index + 1}</td>

                        <td className="fw-semibold">{discount.code}</td>

                        <td className="text-center">
                          <span className="badge bg-primary">
                            {discount.discountPercentage}٪
                          </span>
                        </td>

                        <td className="text-center">
                          {new Date(discount.expirationDate).toLocaleDateString(
                            "fa-IR",
                          )}
                        </td>

                        <td className="text-center ">
                          <span
                            className={`badge ${discount.isActive ? "bg-success" : "bg-danger"}`}
                          >
                            {discount.isActive ? "فعال" : "منقضی"}
                          </span>
                        </td>

                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <Link
                              href={`/admin/discounts/edit/${discount._id}`}
                              className="btn btn-warning btn-sm"
                            >
                              <AiOutlineEdit size={18} />
                            </Link>

                            <button
                              onClick={() => handleDelete(discount._id)}
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
              </>
            )}
          </main>
        </Col>
      </Row>
    </Container>
  );
};

export default Discount;
