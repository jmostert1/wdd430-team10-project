import { Suspense } from "react";
import GalleryClient from "./GalleryClient";

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <GalleryClient />
    </Suspense>
  );
}
