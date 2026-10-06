/**
 * Site photography. Real photos from Unsplash (free to use under the Unsplash
 * License, no attribution required). Swap any URL for ICG's own photos by
 * dropping a file in /public/images and pointing the entry at "/images/<file>".
 */
const unsplash = (id: string, width = 2000) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;

export const SITE_IMAGES = {
  /** Bandra–Worli Sea Link, Mumbai. */
  homeHero: unsplash("photo-1569758267239-d08deb78bb1a"),
  /** Water released from a dam spillway. */
  homeFeature: unsplash("photo-1647614381422-4e84d66ee1c4", 1400),
  /** Aerial view of a highway and city. */
  aboutHero: unsplash("photo-1708357997379-e55c1636e0d7"),
  /** Stone archway with India Gate beyond. */
  purposeHero: unsplash("photo-1662852742109-2c05a1274bf8"),
  /** A team in a working session. */
  careersHero: unsplash("photo-1556761175-5973dc0f32e7"),
  /** Aerial highway beside water. */
  capabilitiesHero: unsplash("photo-1705356395716-9357ed3156e9"),
  /** Library interior with warm lights and tall shelves. */
  blogsHero: unsplash("photo-1481627834876-b7833e8f5570"),
  /** Team collaborating around a whiteboard (Careers culture section). */
  careersCulture: unsplash("photo-1758873269035-aae0e1fd3422", 1400),
} as const;
