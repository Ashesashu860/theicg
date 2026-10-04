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
  careersHero: unsplash("photo-1577962917302-cd874c4e31d2"),
} as const;
