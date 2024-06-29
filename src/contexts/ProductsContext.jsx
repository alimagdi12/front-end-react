import React, { createContext, useState, useEffect, useContext } from "react";
import LoaderContext from "./LoaderContext";

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const { setLoader } = useContext(LoaderContext);
  const fetchProducts = async () => {
    setLoader(true);
    try {
      const response = await fetch(
        "https://portsaidrentals.onrender.com/api/v1/products/get-products"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setProducts(data);
      setLoader(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setLoader(false);
    }
  };

  useEffect(() => {
    // setLoader(true)
    fetchProducts();
  }, []);

  return (
    <ProductsContext.Provider value={{ products, fetchProducts }}>
      {children}
    </ProductsContext.Provider>
  );
};

export default ProductsContext;
