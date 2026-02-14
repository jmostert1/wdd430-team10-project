import Image from "next/image";

type ReviewCardProps = {
  name: string;
  date: string;
  rating: number;
  text: string;
  avatarSrc?: string;
};

export default function ReviewCard({
  name,
  date,
  rating,
  text,
  avatarSrc,
}: ReviewCardProps) {
  const stars = Math.round(rating);

  return (
    <div className="reviewPreview">
      <div className="reviewPreview__top">
        {avatarSrc ? (
          <Image
            className="avatar"
            src={avatarSrc}
            alt={`${name} avatar`}
            width={40}
            height={40}
          />
        ) : (
          <div className="avatar" />
        )}

        <div className="reviewPreview__meta">
          <div className="reviewPreview__header">
            <span className="reviewPreview__name">{name}</span>
            <span className="stars stars--sm" aria-label={`${stars} star rating`}>
              {"★".repeat(stars)}
            </span>
          </div>

          <div className="reviewPreview__date">{date}</div>
        </div>
      </div>

      <p className="reviewPreview__text">{text}</p>
    </div>
  );
}
