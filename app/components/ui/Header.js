import React from "react";
import { Button, Navbar, NavbarBrand } from "react-bootstrap";
import { FaBarsProgress } from "react-icons/fa6";

const Header = () => {
  return (
    <Navbar
      bg="light"
      expand="lg"
      className="d-flex justify-content-between px-3"
    >
      <NavbarBrand className=" ">پنل ادمین </NavbarBrand>
      <Button className="d-md-none">
        <FaBarsProgress />
      </Button>
    </Navbar>
  );
};

export default Header;
