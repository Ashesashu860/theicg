"use client";

import Image from "next/image";
import { useState } from "react";

type UserAvatarProps = {
  name?: string | null;
  email?: string | null;
  photoURL?: string | null;
  size?: number;
  className?: string;
  priority?: boolean;
};

export function getNameInitial(name?: string | null, email?: string | null) {
  const displayName = name?.trim();
  if (displayName) return displayName[0]!.toUpperCase();
  const mail = email?.trim();
  if (mail) return mail[0]!.toUpperCase();
  return "U";
}

export function UserAvatar({
  name,
  email,
  photoURL,
  size = 40,
  className = "",
  priority = false,
}: UserAvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showPhoto = Boolean(photoURL) && !imageFailed;
  const initial = getNameInitial(name, email);
  const label = name?.trim() || email?.trim() || "User";

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-outline-variant bg-surface-container font-sans font-semibold text-primary ${className}`}
      style={{ width: size, height: size, fontSize: Math.max(12, size * 0.35) }}
      aria-hidden={showPhoto ? undefined : true}
    >
      {showPhoto ? (
        <Image
          src={photoURL!}
          alt={label}
          width={size}
          height={size}
          className="h-full w-full object-cover"
          priority={priority}
          unoptimized
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span>{initial}</span>
      )}
    </span>
  );
}
