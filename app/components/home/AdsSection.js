import Image from "next/image";
import React from "react";

const AdsSection = () => {
  return (
    <section className="mb-3">
      <section className="container-xxl">
        <section className="row py-4">
          <section className="col-12 col-md-6 mt-2 mt-md-0">
            <Image
              src="/images/ads/two-col-1.jpg"
              width={800}
              height={200}
              alt="ads"
              className="d-block rounded-2 w-100 h-auto "
            />
          </section>
          <section className="col-12 col-md-6 mt-2 mt-md-0">
            <Image
              src="/images/ads/two-col-2.jpg"
              width={800}
              height={200}
              alt="ads"
              className="d-block rounded-2 w-100 h-auto "
            />
          </section>
        </section>
      </section>
    </section>
  );
};

export default AdsSection;
