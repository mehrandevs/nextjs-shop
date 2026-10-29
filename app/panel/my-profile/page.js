"use client";
import SidebarPanel from "@/app/components/ui/SidebarPanel";
import React from "react";
import "../../styles/profile.css";

const myProfile = () => {
  return (
    <section className="">
      <section id="main-body-two-col" className="container-xxl body-container">
        <section className="row">
          <SidebarPanel />
          <main id="main-body" className="main-body col-md-9">
            <section className="content-wrapper bg-white p-3 rounded-2 mb-2">
              <section className="content-header mb-4">
                <section className="d-flex justify-content-between align-items-center">
                  <h2 className="content-header-title">
                    <span>اطلاعات حساب</span>
                  </h2>
                  <section className="content-header-link">
                    {/* <!--<a href="#">مشاهده همه</a>--> */}
                  </section>
                </section>
              </section>

              <section className="d-flex justify-content-end my-4">
                <a
                  className="btn btn-link btn-sm text-info text-decoration-none mx-1"
                  href="#"
                >
                  <i className="fa fa-edit px-1"></i>ویرایش حساب
                </a>
              </section>

              <section className="row">
                <section className="col-6 border-bottom mb-2 py-2">
                  <section className="field-title">نام</section>
                  <section className="field-value overflow-auto">
                    کامران
                  </section>
                </section>

                <section className="col-6 border-bottom my-2 py-2">
                  <section className="field-title">نام خانوادگی</section>
                  <section className="field-value overflow-auto">محمدی</section>
                </section>

                <section className="col-6 border-bottom my-2 py-2">
                  <section className="field-title">شماره تلفن همراه</section>
                  <section className="field-value overflow-auto">
                    09125468734
                  </section>
                </section>

                <section className="col-6 border-bottom my-2 py-2">
                  <section className="field-title">ایمیل</section>
                  <section className="field-value overflow-auto">
                    hassan.khosrojerdi@gmail.com
                  </section>
                </section>

                <section className="col-6 my-2 py-2">
                  <section className="field-title">کد ملی</section>
                  <section className="field-value overflow-auto">
                    6748392849
                  </section>
                </section>

                <section className="col-6 my-2 py-2">
                  <section className="field-title">رمز عبور</section>
                  <section className="field-value overflow-auto"> --- </section>
                </section>
              </section>
            </section>
          </main>
        </section>
      </section>
    </section>
  );
};

export default myProfile;
