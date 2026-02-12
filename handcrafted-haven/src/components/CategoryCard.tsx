import Image from "next/image";
import Link from "next/link";

interface CategoryCardProps {
  src: string;
  alt: string;
  title: string;
  href: string;
}

export default function CategoryCard({ src, alt, title, href }: CategoryCardProps) {
  return (
    <Link href={href} className="card">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 900px) 100vw, 33vw"
        className="card__img"
      />

      {/* overlay */}
      <div className="card__overlay">
        <h3 className="card__title">{title}</h3>
      </div>
    </Link>
  );
}
