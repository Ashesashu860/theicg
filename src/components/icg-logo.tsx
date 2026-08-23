type IcgLogoProps = {
  className?: string;
  /** Icon grid only (header) vs full mark with wordmark (about). */
  variant?: "mark" | "full";
  title?: string;
};

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
        <g fill="currentColor">
          <rect x="50" y="50" width="40" height="40" />
          <rect x="100" y="100" width="40" height="40" />
        </g>
        <rect
          x="100"
          y="50"
          width="40"
          height="40"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <rect
          x="50"
          y="100"
          width="40"
          height="40"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
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
      <g fill="currentColor">
        <rect x="50" y="50" width="40" height="40" />
        <rect x="100" y="100" width="40" height="40" />
      </g>
      <rect
        x="100"
        y="50"
        width="40"
        height="40"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="50"
        y="100"
        width="40"
        height="40"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <text
        x="100"
        y="180"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="36"
        textAnchor="middle"
        fill="currentColor"
      >
        ICG
      </text>
    </svg>
  );
}
