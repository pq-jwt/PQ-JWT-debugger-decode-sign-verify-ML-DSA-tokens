import { NIST_FIPS_204 } from "../lib/ecosystem-links";

type Size = "sm" | "md" | "lg" | "xl";

interface Props {
  size?: Size;
  /** Link target — standards page or NIST home */
  href?: string;
  className?: string;
}

/** Display heights — source PNG is 397×200; avoid going below ~40px or text becomes illegible */
const HEIGHT: Record<Size, number> = { sm: 40, md: 52, lg: 72, xl: 100 };

export default function NistLogo({ size = "md", href = NIST_FIPS_204, className = "" }: Props) {
  const h = HEIGHT[size];
  const w = Math.round(h * (397 / 200));

  const img = (
    <img
      src="/nist-logo.png"
      alt="National Institute of Standards and Technology — U.S. Department of Commerce"
      className="nist-logo-img"
      width={w}
      height={h}
      loading="lazy"
      decoding="async"
    />
  );

  const wrapClass = `nist-logo-wrap nist-logo-${size}${className ? ` ${className}` : ""}`;

  if (!href) {
    return <span className={wrapClass}>{img}</span>;
  }

  return (
    <a
      className={wrapClass}
      href={href}
      target="_blank"
      rel="noreferrer"
      title="NIST — FIPS 204 ML-DSA standard"
    >
      {img}
    </a>
  );
}
