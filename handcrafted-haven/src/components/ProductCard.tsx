import styles from "./ProductCard.module.css";

type ProductCardProps = {
  name: string;
  price: number;
  imageSrc?: string;
};

export default function ProductCard({ name, price, imageSrc }: ProductCardProps) {
  return (
    <article className="work">
      <div className="work__img">
        <img
          src={imageSrc}
          alt={name}
          className={styles.image}
        />
      </div>

      <div className="work__meta">
        <div className="work__name">{name}</div>
        <div className="work__price">$ {price.toFixed(2)}</div>
      </div>
    </article>
  );
}

