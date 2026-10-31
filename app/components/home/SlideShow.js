import Image from "next/image";
import React from "react";

const SlideShow = () => {
  return (
    <section className="row">
      <section className="col-md-8 pe-md-1">
        <section id="slideshow" className="owl-carousel owl-theme">
          <section className="item">
            <a className="w-100 d-block h-auto text-decoration-none" href="#">
              <Image
                src="/images/slideshow/1.jpg"
                width={800}
                height={400}
                alt="slideshow-1"
                priority
                className="w-100 rounded-2 d-block h-auto"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
            </a>
          </section>
          <section className="item">
            <a className="w-100 d-block h-auto text-decoration-none" href="#">
              <Image
                src="/images/slideshow/2.jpg"
                width={800}
                height={400}
                alt="slideshow-2"
                priority
                className="w-100 rounded-2 d-block h-auto"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
            </a>
          </section>
          <section className="item">
            <a className="w-100 d-block h-auto text-decoration-none" href="#">
              <Image
                src="/images/slideshow/3.jpg"
                width={800}
                height={400}
                alt="slideshow-3"
                className="w-100 rounded-2 d-block h-auto"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
            </a>
          </section>
          <section className="item">
            <a className="w-100 d-block h-auto text-decoration-none" href="#">
              <Image
                src="/images/slideshow/4.jpg"
                width={800}
                height={400}
                alt="slideshow-4"
                className="w-100 rounded-2 d-block h-auto"
              />
            </a>
          </section>
          <section className="item">
            <a className="w-100 d-block h-auto text-decoration-none" href="#">
              <Image
                src="/images/slideshow/5.jpg"
                width={800}
                height={400}
                alt="slideshow-5"
                className="w-100 rounded-2 d-block h-auto"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
            </a>
          </section>
          <section className="item">
            <a className="w-100 d-block h-auto text-decoration-none" href="#">
              <Image
                src="/images/slideshow/6.gif"
                width={800}
                height={400}
                alt="slideshow-1"
                className="w-100 rounded-2 d-block h-auto"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
            </a>
          </section>
        </section>
      </section>
      <section className="col-md-4 ps-md-1 mt-2 mt-md-0">
        <section className="mb-2">
          <a href="#" className="d-block">
            <Image
              src="/images/slideshow/12.gif"
              width={400}
              height={200}
              alt="slideshow-1"
              className=" w-100 h-auto rounded-2"
            />
          </a>
        </section>
        <section className="mb-2">
          <a href="#" className="d-block">
            <Image
              src="/images/slideshow/11.jpg"
              width={400}
              height={200}
              alt="slideshow-1"
              className="w-100 h-auto rounded-2"
            />
          </a>
        </section>
      </section>
    </section>
  );
};

export default SlideShow;
