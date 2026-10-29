"use client";
import React from "react";
import "../../styles/filter.css";
import Link from "next/link";
import { Button } from "react-bootstrap";
import { signOut } from "next-auth/react";

const SidebarPanel = () => {
  return (
    <aside id="sidebarPanel" className="sidebarPanel col-md-3">
      <section className="content-wrapper bg-white p-3 rounded-2 mb-3">
        <section className="sidebarPanel-nav">
          <section className="sidebarPanel-nav-item">
            <span className="sidebarPanel-nav-item-title">
              <Link className="p-3" href="/panel/my-orders">
                سفارش های من
              </Link>
            </span>
          </section>
          <section className="sidebarPanel-nav-item">
            <span className="sidebarPanel-nav-item-title">
              <Link className="p-3" href="/panel/my-addresses">
                آدرس های من
              </Link>
            </span>
          </section>
          <section className="sidebarPanel-nav-item">
            <span className="sidebarPanel-nav-item-title">
              <Link className="p-3" href="/panel/my-profile">
                لیست علاقه مندی
              </Link>
            </span>
          </section>
          <section className="sidebarPanel-nav-item">
            <span className="sidebarPanel-nav-item-title">
              <Link className="p-3" href="/panel/my-profile">
                ویرایش حساب
              </Link>
            </span>
          </section>
          <section className="sidebarPanel-nav-item">
            <span className="sidebarPanel-nav-item-title">
              <Button
                onClick={() => {
                  signOut();
                }}
                className="btn w-100"
                variant="danger"
              >
                خروج از حساب کاربری
              </Button>
            </span>
          </section>
        </section>
      </section>
    </aside>
  );
};

export default SidebarPanel;
