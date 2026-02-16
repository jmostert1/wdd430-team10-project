import styles from "./ProductCard.module.css";
import Image from "next/image";


type ProductCardProps = {
  name: string;
  price: number;
  imageSrc?: string;
};

export default function ProductCard({ name, price, imageSrc }: ProductCardProps) {
  return (
    <article className="work">
      <div className="work__img">
        <Image
          src={imageSrc || "/products/default-product.png"}
          alt={name}
          className={styles.image}
          width={300}
          height={300}
        />

      </div>

      <div className="work__meta">
        <div className="work__name">{name}</div>
        <div className="work__price">$ {price.toFixed(2)}</div>
      </div>
    </article>
  );
}

