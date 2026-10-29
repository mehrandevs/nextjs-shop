import React from "react";
import Skeleton from "react-loading-skeleton";

const ProductCardSkeleton = () => {
  return (
    <section className="item">
      <section className="lazyload-item-wrapper">
        <section className="product">
          <section className="product-image">
            <Skeleton width={200} height={200} />
          </section>
          <section className="product-name">
            <Skeleton width={150} height={20} />
          </section>
          <section className="product-price-wrapper">
            <Skeleton width={80} height={18} />
          </section>
        </section>
      </section>
    </section>
  );
};

export default ProductCardSkeleton;
