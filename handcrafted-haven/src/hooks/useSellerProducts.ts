import { useEffect, useState } from "react";

export default function useSellerProducts(sellerId: string) {
  const [products, setProducts] = useState<any[]>([]);
  const [loadingWorks, setLoadingWorks] = useState(true);

  useEffect(() => {
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

  return { products, loadingWorks };
}
