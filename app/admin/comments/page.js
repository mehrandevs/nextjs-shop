"use client";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import Sidebar from "@/app/components/ui/Sidebar";
import Header from "@/app/components/ui/Header";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import GeneralError from "@/app/components/ui/GeneralError";
import { AiOutlineDelete } from "react-icons/ai";
import { FaCheck } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { toast } from "react-toastify";
import useAuth from "@/app/hooks/use-auth";

const Comments = () => {
  const { isLoggedIn, isAdmin } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/comments");
        const data = await response.json();
        if (!response.ok) {
          setError(data.message || "خطا در دریفات نظرات ");
          return;
        }

        setComments(data);
      } catch (error) {
        setError("مشکلی در ارتباط با سرور پیش آمده است");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id, item) => {
    const confirmed = window.confirm("آیا از حذف این نظر مطمئن هستید؟");
    if (!confirmed) return;
    if (!isLoggedIn) return toast.error("شما وارد نشده‌اید");
    if (!isAdmin) return toast.error("دسترسی ندارید");

    try {
      setLoadingBtn(true);
      const response = await fetch(`/api/comments/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "خطا در حذف کد تخفیف");
        return;
      }
      toast.success(` نظر  شماره ${item} حذف شد `, {
        position: "top-center",
      });
      setComments(comments.filter((comment) => comment._id !== id));
    } catch (error) {
      setError("مشکلی در ارتباط با سرور پیش آمده است");
    } finally {
      setLoadingBtn(false);
    }
  };

  const handleActive = async (id, status, item) => {
    const confirmed = window.confirm(
      `آیا از  ${status ? "عدم تایید" : "تایید"} این  نظر مطمئن هستید؟`,
    );
    if (!confirmed) return;
    if (!isLoggedIn) return toast.error("شما وارد نشده‌اید");
    if (!isAdmin) return toast.error("دسترسی ندارید");

    setLoadingBtn(true);
    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !status }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "مشکلی در ویرایش نظر پیش آمده است");
        return;
      }

      if (status) {
        toast.success(`نظر  شماره ${item} تایید شد  `, {
          position: "top-center",
        });
      } else {
        toast.warning(`نظر  شماره ${item} عدم تایید شد  `, {
          position: "top-center",
        });
      }

      setComments((prevComments) =>
        prevComments.map((item) =>
          item._id === id
            ? {
                ...item,
                isActive: !status,
              }
            : item,
        ),
      );
    } catch (error) {
      setError("مشکلی در ارتباط با سرور پیش آمده است");
    } finally {
      setLoadingBtn(false);
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
            <h4 className="my-4">مدیرت نظرات</h4>
            {error && <GeneralError error={error} />}
            {loading ? (
              <LoadingSpinner />
            ) : (
              <>
                <Table hover responsive className="align-middle mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th>#</th>
                      <th>نام کاربر</th>
                      <th>موبایل کاربر</th>
                      <th style={{ width: "500px" }}>نظر</th>
                      <th>محصول</th>
                      <th>وضعیت تایید</th>
                      <th>تاریخ ثبت</th>
                      <th>عملیات</th>
                    </tr>
                  </thead>

                  <tbody>
                    {comments.map((comment, index) => (
                      <tr key={comment._id}>
                        <td className="text-center">{index + 1}</td>

                        <td className="text-center">{comment.user?.name}</td>

                        <td className="text-center">{comment.user?.phone}</td>

                        <td style={{ width: "500px" }}>
                          <div className="comment-box">
                            <div className="comment-icon">💬</div>

                            <div className="comment-content">
                              <span className="comment-label">نظر کاربر</span>

                              <p className="comment-text">{comment.text}</p>
                            </div>
                          </div>
                        </td>

                        <td className="text-center">{comment.product?.name}</td>

                        <td className="text-center">
                          {comment.isActive ? (
                            <span className="badge bg-success">تایید شده</span>
                          ) : (
                            <span className="badge bg-warning text-black">
                              تایید نشده
                            </span>
                          )}
                        </td>

                        <td className="text-center">
                          {new Date(comment.createdAt).toLocaleDateString(
                            "fa-IR",
                          )}
                        </td>
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <>
                              <button
                                className={`btn ${comment.isActive ? "btn-warning" : "btn-success"} btn-success btn-sm`}
                                onClick={() =>
                                  handleActive(
                                    comment._id,
                                    comment.isActive,
                                    index + 1,
                                  )
                                }
                                disabled={loadingBtn}
                              >
                                {comment.isActive ? (
                                  <IoCloseSharp size={18} />
                                ) : (
                                  <FaCheck size={18} />
                                )}
                              </button>
                            </>

                            <button
                              onClick={() =>
                                handleDelete(comment._id, index + 1)
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
              </>
            )}
          </main>
        </Col>
      </Row>
    </Container>
  );
};

export default Comments;
