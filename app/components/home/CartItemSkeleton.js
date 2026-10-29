import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import React from "react";

const CartItemSkeleton = () => (
  <section className="cart-item d-md-flex py-3">
    <section className="cart-img align-self-start flex-shrink-1">
      <Skeleton width={80} height={80} />
    </section>
    <section className="align-self-start w-100 me-3">
      <Skeleton width={180} height={24} className="mb-2" />
      <Skeleton width={230} className="mb-1" />
      <Skeleton width={170} className="mb-2" />
      <section className="d-flex align-items-center gap-3">
        <Skeleton width={110} height={32} />
        <Skeleton width={70} height={20} />
      </section>
    </section>
    <section className="align-self-end flex-shrink-1">
      <Skeleton width={90} height={20} />
    </section>
  </section>
);

export default CartItemSkeleton;
