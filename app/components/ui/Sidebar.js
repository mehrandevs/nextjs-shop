"use client";
import Link from "next/link";
import React from "react";
import { Nav } from "react-bootstrap";
import {
  TbHome,
  TbCategoryPlus,
  TbBox,
  TbPercentage,
  TbMessageCircle,
  TbBuildingWarehouse,
  TbUsers,
} from "react-icons/tb";
import { usePathname } from "next/navigation";
import Image from "next/image";

const Sidebar = () => {
  const pathName = usePathname();
  return (
    <aside className=" sidebar">
        <section className="border-bottom p-2 ">
         <Link href="/" >
          <Image
            src="/images/logo/8.png"
            alt="logo"
            width={80}
            height={30}
            className=""
          />
         </Link>
        </section>
      <Nav className="flex-column ">

        <Link href="/admin" className={pathName === "/admin" ? "active" : ""}>
          <TbHome />
          داشبورد
        </Link>

        <Link
          href="/admin/categories"
          className={pathName === "/admin/categories" ? "active" : ""}
        >
          <TbCategoryPlus />
          دسته بندی ها
        </Link>

        <Link
          href="/admin/products"
          className={pathName === "/admin/products" ? "active" : ""}
        >
          <TbBox />
          محصول ها
        </Link>

        <Link
          href="/admin/discounts"
          className={pathName === "/admin/discounts" ? "active" : ""}
        >
          <TbPercentage />
          مدیریت کد های تخفیف
        </Link>

        <Link
          href="/admin/comments"
          className={pathName === "/admin/comments" ? "active" : ""}
        >
          <TbMessageCircle />
          مدیریت نظرات
        </Link>

        <Link
          href="/admin/stock"
          className={pathName === "/admin/stock" ? "active" : ""}
        >
          <TbBuildingWarehouse />
          مدیریت انبار
        </Link>
        <Link
          href="/admin/users"
          className={pathName === "/admin/users" ? "active" : ""}
        >
          <TbUsers />
          مدیریت کاربران
        </Link>
      </Nav>
    </aside>
  );
};

export default Sidebar;
