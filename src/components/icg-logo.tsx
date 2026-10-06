type IcgLogoProps = {
  className?: string;
  /** Icon grid only (header) vs full mark with wordmark (about). */
  variant?: "mark" | "full";
  title?: string;
};

/** 40×40 outline square: outer edge matches filled squares (stroke would overflow). */
function OutlineSquare({ x, y }: { x: number; y: number }) {
  const inset = 2;
  return (
    <path
      fill="currentColor"
      fillRule="evenodd"
      d={`M${x} ${y}h40v40h-40z M${x + inset} ${y + inset}h${40 - inset * 2}v${40 - inset * 2}h-${40 - inset * 2}z`}
    />
  );
}

function LogoMark() {
  return (
    <>
      <rect x="50" y="50" width="40" height="40" fill="currentColor" />
      <rect x="100" y="100" width="40" height="40" fill="currentColor" />
      <OutlineSquare x={100} y={50} />
      <OutlineSquare x={50} y={100} />
    </>
  );
}

export function IcgLogo({
  className,
  variant = "full",
  title = "ICG",
}: IcgLogoProps) {
  if (variant === "mark") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="48 48 94 94"
        className={className}
        role="img"
        aria-label={title}
      >
        <title>{title}</title>
        <LogoMark />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <LogoMark />
      <text
        x="100"
        y="180"
        fontFamily="var(--font-inter), Inter, system-ui, sans-serif"
        fontWeight="600"
        letterSpacing="-1"
        fontSize="36"
        textAnchor="middle"
        fill="currentColor"
      >
        ICG
      </text>
    </svg>
  );
}
