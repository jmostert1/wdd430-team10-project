import { useEffect, useState, useCallback } from "react";

type Product = {
  _id: string;
  name: string;
  price: number;
  category?: string;
  imageUrl?: string[];
  rating?: number;
};

export default function useSellerProducts(sellerId: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingWorks, setLoadingWorks] = useState(true);

  const fetchProducts = useCallback(() => {
    // if not sellerId -> stop loading and clear products
    if (!sellerId) {
      setProducts([]);
      setLoadingWorks(false);
      return;
    }

    setLoadingWorks(true);

    fetch(`/api/products/by-seller?sellerId=${encodeURIComponent(sellerId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setProducts(data.products ?? []);
        else setProducts([]);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoadingWorks(false));
  }, [sellerId]);

  useEffect(() => {
  const run = async () => {
    await fetchProducts();
  };

  run();
}, [fetchProducts]);

  return { products, loadingWorks, refetchProducts: fetchProducts };
}
