"use client";

import React, { useState } from "react";
import { Button, Navbar, NavbarBrand } from "react-bootstrap";
import { FaBarsProgress } from "react-icons/fa6";
import SidebarAdminOffcanvas from "./SidebarAdminOffcanvas";

const Header = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      <Navbar
        bg="light"
        expand="lg"
        className="d-flex justify-content-between px-3"
      >
        <NavbarBrand>پنل ادمین</NavbarBrand>

        <Button
          className="d-md-none"
          onClick={() => setShowSidebar(true)}
        >
          <FaBarsProgress />
        </Button>
      </Navbar>

      <SidebarAdminOffcanvas
        show={showSidebar}
        onHide={() => setShowSidebar(false)}
      />
    </>
  );
};

export default Header;