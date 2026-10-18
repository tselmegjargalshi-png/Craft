export function SectionHeading({
  eyebrow,
  title,
  sub,
  align = "left",
  light = false,
  as: H = "h2",
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  align?: "left" | "center";
  light?: boolean;
  as?: "h1" | "h2";
}) {
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className={`eyebrow ${light ? "!text-[#ff8a70]" : ""}`}>{eyebrow}</p>}
      <H className={`h-section ${eyebrow ? "mt-3" : ""} ${light ? "text-paper" : ""}`}>{title}</H>
      {sub && <p className={`lead mt-4 ${light ? "!text-paper/70" : ""}`}>{sub}</p>}
    </div>
  );
}
