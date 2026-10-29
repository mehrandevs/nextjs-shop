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

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <aside className="h-100">
      <Nav className="flex-column sidebar">
        <Link href="/admin" className={pathname === "/admin" ? "active" : ""}>
          <TbHome />
          داشبورد
        </Link>

        <Link
          href="/admin/categories"
          className={pathname === "/admin/categories" ? "active" : ""}
        >
          <TbCategoryPlus />
          دسته بندی ها
        </Link>

        <Link
          href="/admin/products"
          className={pathname === "/admin/products" ? "active" : ""}
        >
          <TbBox />
          محصول ها
        </Link>

        <Link
          href="/admin/discounts"
          className={pathname === "/admin/discounts" ? "active" : ""}
        >
          <TbPercentage />
          مدیریت کد های تخفیف
        </Link>

        <Link
          href="/admin/comments"
          className={pathname === "/admin/comments" ? "active" : ""}
        >
          <TbMessageCircle />
          مدیریت نظرات
        </Link>

        <Link
          href="/admin/stock"
          className={pathname === "/admin/stock" ? "active" : ""}
        >
          <TbBuildingWarehouse />
          مدیریت انبار
        </Link>
        <Link
          href="/admin/users"
          className={pathname === "/admin/users" ? "active" : ""}
        >
          <TbUsers />
          مدیریت کاربران
        </Link>
      </Nav>
    </aside>
  );
};

export default Sidebar;
