"use client";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import Sidebar from "@/app/components/ui/Sidebar";
import Header from "@/app/components/ui/Header";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import GeneralError from "@/app/components/ui/GeneralError";
import { AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";
import Link from "next/link";
import { AiOutlinePlus, AiOutlineEdit } from "react-icons/ai";
import useAuth from "@/app/hooks/use-auth";

const Users = () => {
  const { isLoggedIn, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        if (!response.ok) {
          setError(data.message || "خطا در دریفات کاربران");
          return;
        }

        setUsers(data);
      } catch (error) {
        setError("مشکلی در ارتباط با سرور پیش آمده است");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(`آیا از حذف کاربر: ${name}  مطمئن هستید؟`);
    if (!confirmed) return;
    if (!isLoggedIn) return toast.error("شما وارد نشده‌اید");
    if (!isAdmin) return toast.error("دسترسی ندارید");

    try {
      setLoadingBtn(true);
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "خطا در حذف کاربر ");
        return;
      }
      toast.success(`کاربر :${name} با موفقیت حذف شد`, {
        position: "top-center",
      });
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      setError("مشکلی در ارتباط با سرور پیش آمده است");
    } finally {
      setLoadingBtn(false);
    }
  };

  const handleAdmin = async (id, status, name) => {
    const confirmed = window.confirm(
      ` آیا از تغییر نقش این کاربر از${status ? "ادمین" : "کاربر عادی"} به ${status ? "کاربر عادی" : "ادمین"} مطمئن هستید؟`,
    );
    if (!confirmed) return;
    if (!isLoggedIn) return toast.error("شما وارد نشده‌اید");
    if (!isAdmin) return toast.error("دسترسی ندارید");

    setLoadingBtn(true);
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isAdmin: !status }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "مشکلی در ویرایش نظر پیش آمده است");
        return;
      }

      toast.success(
        status
          ? `نقش «${name}» با موفقیت به کاربر عادی تغییر کرد`
          : `نقش «${name}» با موفقیت به ادمین تغییر کرد`,
        {
          position: "top-center",
        },
      );
      setUsers((prevUsers) =>
        prevUsers.map((item) =>
          item._id === id
            ? {
                ...item,
                isAdmin: !status,
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
            <h4 className="my-4">مدیرت کاربران</h4>
            {error && <GeneralError error={error} />}
            {loading ? (
              <LoadingSpinner />
            ) : (
              <>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <Link
                    href="/admin/users/add"
                    className="btn btn-primary d-flex align-items-center gap-2"
                  >
                    <AiOutlinePlus />
                    افزودن کاربر
                  </Link>
                </div>
                <Table hover responsive className="align-middle mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th>شناسه</th>
                      <th>نام کاربر</th>
                      <th>موبایل کاربر</th>
                      <th>وضعیت </th>
                      <th>عملیات</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((user, index) => (
                      <tr key={user._id}>
                        <td>{user._id}</td>

                        <td>{user.name}</td>

                        <td>{user.phone}</td>

                        <td>
                          {user.isAdmin ? (
                            <span className="badge bg-success">آدمین</span>
                          ) : (
                            <span className="badge bg-warning text-black">
                              کاربر عادی
                            </span>
                          )}
                        </td>

                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <>
                              <button
                                className={`btn ${user.isAdmin ? "btn-warning" : "btn-success"} btn-success btn-sm`}
                                onClick={() =>
                                  handleAdmin(user._id, user.isAdmin, user.name)
                                }
                                disabled={loadingBtn}
                              >
                                {user.isAdmin
                                  ? "تبدیل به کاربر"
                                  : "تبدیل به آدمین"}
                              </button>
                            </>

                            <Link
                              href={`/admin/users/edit/${user._id}`}
                              className="btn btn-info btn-sm"
                            >
                              <AiOutlineEdit size={18} />
                              ویرایش
                            </Link>
                            <button
                              onClick={() => handleDelete(user._id, user.name)}
                              className="btn btn-danger btn-sm"
                              disabled={loadingBtn}
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

export default Users;
