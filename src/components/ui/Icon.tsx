/* eslint-disable @next/next/no-img-element -- Los SVG se conservan como archivos, con sus dimensiones originales. */
export function Icon({
  name,
  className = '',
}: {
  name: string;
  className?: string;
}) {
  return (
    <img
      className={`icon ${className}`}
      src={`/icons/${name}.svg`}
      alt=""
      aria-hidden="true"
    />
  );
}
