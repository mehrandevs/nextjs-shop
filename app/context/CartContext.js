"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], discountPrice: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItem, setUpdatingItem] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setError(null);

        const response = await fetch("/api/cart");

        if (!response.ok) {
          setError("اطلاعت کارت دریفات نشد");
          setCart({ items: [], discountPrice: 0 });
        }
        const data = await response.json();
        setCart(data && data.items ? data : { items: [], discountPrice: 0 });
      } catch (error) {
        setError(error);
        setCart({ items: [], discountPrice: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const updateCart = async () => {
    try {
      const response = await fetch("/api/cart");
      if (response.ok) {
        const updateCart = await response.json();
        setCart(updateCart);
      }
    } catch (error) {
      console.log("خطا در بروزرسانی");
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      setUpdatingItem(productId);
      setError(null);
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        setError(
          "مشکلی در اضافه کردن به سبد خرید پیش امده است " || errorData.message,
        );
        return;
      }
      await updateCart();
      toast.success("محصول به سبد خرید اضافه شد");
    } catch (error) {
      setError("مشکلی در اضافه کردن به سبد خرید پیش امده است ");
    } finally {
      setUpdatingItem(null);
    }
  };

  const decreaseQuantity = async (productId) => {
    try {
      const item = cart.items.find((item) => item.product._id === productId);
      if (!item) {
        setError("محصول مورد نظر یافت نشد");
        return;
      }
      setUpdatingItem(productId);
      if (item.quantity <= 1) {
        await removeFromCart(productId);
        return;
      }

      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: -1 }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || "مشکلی در کاهش تعداد پیش آمده است");
      }
      toast.warning("محصول با موفقیت کم شد ");
      await updateCart();
    } catch (error) {
    } finally {
      setUpdatingItem(null);
    }
  };
  const increaseQuantity = async (productId) => {
    try {
      const item = cart.items.find((item) => item.product._id === productId);
      if (!item || item.quantity >= item.product.stock) {
        setError("موجودی کافی نیست");
        return;
      }

      setUpdatingItem(productId);

      await addToCart(productId, 1);
    } catch (error) {
      setError("مشکلی در کاهش افزایش پیش آمده است");
    } finally {
      setUpdatingItem(null);
    }
  };
  const removeFromCart = async (productId) => {
    try {
      setUpdatingItem(productId);
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || "مشکلی در حذف محصول پیش آمده است");
        return;
      }
      await updateCart();
      toast.success("محصول با موفقیت حذف شد ");
    } catch (error) {
      setError("مشکلی در حذف محصول پیش آمده است");
    } finally {
      setUpdatingItem(null);
    }
  };
  function clearCart() {
    setCart({ items: [], discountPrice: 0 });
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        error,
        loading,
        updatingItem,
        addToCart,
        decreaseQuantity,
        increaseQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
