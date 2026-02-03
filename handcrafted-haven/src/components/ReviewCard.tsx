type ReviewCardProps = {
  name: string;
  date: string;
  rating: number;
  text: string;
};

export default function ReviewCard({
  name,
  date,
  rating,
  text,
}: ReviewCardProps) {
  return (
    <div className="reviewPreview">
      <div className="reviewPreview__top">
        <div className="avatar" />

        <div className="reviewPreview__meta">
          <div className="reviewPreview__header">
            <span className="reviewPreview__name">{name}</span>
            <span className="stars stars--sm">
              {"★".repeat(rating)}
            </span>
          </div>

          <div className="reviewPreview__date">{date}</div>
        </div>
      </div>

      <p className="reviewPreview__text">{text}</p>
    </div>
  );
}
