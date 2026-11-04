"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Offcanvas, Nav } from "react-bootstrap";
import { usePathname } from "next/navigation";

import {
    TbHome,
    TbCategoryPlus,
    TbBox,
    TbPercentage,
    TbMessageCircle,
    TbBuildingWarehouse,
    TbUsers,
} from "react-icons/tb";

const SidebarAdminOffcanvas = ({ show, onHide }) => {

    return (
        <Offcanvas
            show={show}
            onHide={onHide}
            placement="top"
        >
            <Offcanvas.Header closeButton className="border-bottom">
                <Link href="/" onClick={onHide}>
                    <Image
                        src="/images/logo/8.png"
                        alt="logo"
                        width={80}
                        height={30}
                    />
                </Link>  </Offcanvas.Header>

            <Offcanvas.Body className="p-0">

                <Nav className="flex-column p-3 gap-2">

                    <Link href="/admin" onClick={onHide}
                        className={`nav-link d-flex align-items-center gap-`}>
                        <TbHome /> داشبورد
                    </Link>

                    <Link href="/admin/categories" onClick={onHide}
                        className={`nav-link d-flex align-items-center gap-2 rounded `}>
                        <TbCategoryPlus /> دسته بندی ها
                    </Link>

                    <Link href="/admin/products" onClick={onHide}
                        className={`nav-link d-flex align-items-center gap-2 rounded `}>
                        <TbBox /> محصول ها
                    </Link>

                    <Link href="/admin/discounts" onClick={onHide}
                        className={`nav-link d-flex align-items-center gap-2 rounded `}>
                        <TbPercentage /> مدیریت کد های تخفیف
                    </Link>

                    <Link href="/admin/comments" onClick={onHide}
                        className={`nav-link d-flex align-items-center gap-2 rounded `}>
                        <TbMessageCircle /> مدیریت نظرات
                    </Link>

                    <Link href="/admin/stock" onClick={onHide}
                        className={`nav-link d-flex align-items-center gap-2 rounded `}>
                        <TbBuildingWarehouse /> مدیریت انبار
                    </Link>

                    <Link href="/admin/users" onClick={onHide}
                        className={`nav-link d-flex align-items-center gap-2 rounded `}>
                        <TbUsers /> مدیریت کاربران
                    </Link>

                </Nav>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default SidebarAdminOffcanvas;