import Image from "next/image";
import React from "react";

const BrandSection = () => {
  const brands = [
    {
      id: 1,
      imageUrl: "/images/brand/adata.png",
      alt: "adata",
    },
    {
      id: 2,
      imageUrl: "/images/brand/casio.jpg",
      alt: "casio",
    },
    {
      id: 3,
      imageUrl: "/images/brand/huawei.jpg",
      alt: "huawei",
    },
    {
      id: 4,
      imageUrl: "/images/brand/nokia.jpg",
      alt: "nokia",
    },
    {
      id: 5,
      imageUrl: "/images/brand/snowa.png",
      alt: "snowa",
    },
  ];
  return (
    <section className="brand-part mb-4 py-4">
      <section className="container-xxl">
        <section className="row">
          <section className="col">
            <section className="content-header">
              <section className="d-flex align-items-center">
                <h2 className="content-header-title">
                  <span>برندهای ویژه</span>
                </h2>
              </section>
            </section>
            <section className="brands-wrapper py-4">
              <section className="brands dark-owl-nav owl-carousel owl-theme">
                {brands.map((brand) => {
                  return (
                    <section className="item" key={brand.id}>
                      <section className="brand-item">
                        <a href="#">
                          <Image
                            src={brand.imageUrl}
                            width={130}
                            height={130}
                            alt={brand.alt}
                            className="rounded-2 w-auto h-auto"
                          />
                        </a>
                      </section>
                    </section>
                  );
                })}
              </section>
            </section>
          </section>
        </section>
      </section>
    </section>
  );
};

export default BrandSection;
