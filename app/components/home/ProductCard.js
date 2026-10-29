import Image from "next/image";

import Link from "next/link";
import React from "react";

const ProductCard = ({ product }) => {
  return (
    <section className="item">
      <section className="lazyload-item-wrapper">
        <section className="product">
          <Link className="product-link" href={`/products/${product._id}`}>
            <section className="product-image">
              <Image
                src={product.imageUrl}
                width={200}
                height={200}
                alt={product.name}
                className="w-auto h-auto"
              />
            </section>
            <section className="product-colors"></section>
            <section className="product-name">
              <h3>{product.name}</h3>
            </section>
            <section className="product-price-wrapper">
              <section className="product-price">
                {product.price?.toLocaleString()}
                تومان
              </section>
            </section>
          </Link>
        </section>
      </section>
    </section>
  );
};

export default ProductCard;
