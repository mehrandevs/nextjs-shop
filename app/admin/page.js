"use client";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import Sidebar from "../components/ui/Sidebar";
import Header from "../components/ui/Header";
import AuthWrapper from "../components/auth/AuthWrapper";

const AdminDashboard = () => {
  return (
    // <AuthWrapper>
    <Container fluid className="p-0">
      <Row className="g-0">
        <Col md={2} className=" d-none d-md-block">
          <Sidebar />
        </Col>
        <Col sm={12} md={10}>
          <Header />
          <main className="content p-4 h-100 ">
            <h4>به پنل ادمین خوش آمدید</h4>
            <p>در این بخش می توانید موارد مختلف سایت رو مدیریت کنید</p>
          </main>
        </Col>
      </Row>
    </Container>
    // </AuthWrapper>
  );
};

export default AdminDashboard;
