export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type PhotoCrop = { height: number; position?: "top" | "bottom" };

// Copies of the existing q=80 Unsplash responses, without recompression.
// Match the complete framing request so profile photos and lightboxes retain their originals.
const localPhotos: Record<string, { src: string; width: number; height?: number; position?: PhotoCrop["position"] }> = {
  "1777331903190-341a3dd0441b": { src: "/images/smilecare/hero.jpg", width: 1600 },
  "1706565029539-d09af5896340": { src: "/images/smilecare/doctor-ananya.jpg", width: 1200, height: 900, position: "top" },
  "1674775372058-c4c8813c6611": { src: "/images/smilecare/doctor-arjun.jpg", width: 1200, height: 900, position: "top" },
  "1757125736482-328a3cdd9743": { src: "/images/smilecare/doctor-kavya.jpg", width: 1200, height: 900, position: "top" },
  "1629909614456-6b1c5c94cecc": { src: "/images/smilecare/gallery-lounge.jpg", width: 1000 },
  "1629909615184-74f495363b67": { src: "/images/smilecare/gallery-treatment-room.jpg", width: 1000 },
  "1770321119305-f191c09c5801": { src: "/images/smilecare/gallery-dental-unit.jpg", width: 1000 },
  "1654373535457-383a0a4d00f9": { src: "/images/smilecare/transformation-whitening.jpg", width: 1600, height: 1200 },
  "1769559893692-c6d0623bf8e4": { src: "/images/smilecare/transformation-makeover.jpg", width: 1600, height: 1200 },
  "1663182234283-28941e7612da": { src: "/images/smilecare/transformation-cleaning.jpg", width: 1600 },
};

/** Use local clinic photos where available; otherwise preserve the sized Unsplash source. */
export function unsplash(
  id: string,
  width = 1600,
  crop?: PhotoCrop,
) {
  const localPhoto = localPhotos[id];
  if (
    localPhoto?.width === width &&
    localPhoto.height === crop?.height &&
    localPhoto.position === crop?.position
  ) {
    return localPhoto.src;
  }

  const framing = crop ? `&h=${crop.height}${crop.position ? `&crop=${crop.position}` : ""}` : "";
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80${framing}`;
}
