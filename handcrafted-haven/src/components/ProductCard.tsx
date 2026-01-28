type ProductCardProps = {
  name: string;
  price: number;
};

export default function ProductCard({ name, price }: ProductCardProps) {
  return (
    <article className="work">
      <div
        className="work__img"
        aria-label="Product image placeholder"
      />
      <div className="work__meta">
        <div className="work__name">{name}</div>
        <div className="work__price">$ {price.toFixed(2)}</div>
      </div>
    </article>
  );
}
