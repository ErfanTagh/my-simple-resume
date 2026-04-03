import type { CSSProperties } from "react";
import { hasWebLink, normalizeExternalUrl } from "@/lib/contactLinkUtils";

export type ProjectLinkedTitleProps = {
  /** Visible label only; the URL string is never rendered. */
  name: string;
  link?: string | null;
  className?: string;
  anchorStyle?: CSSProperties;
  /** Match surrounding text color (default true). Set false when using e.g. `text-primary` on className. */
  inheritColor?: boolean;
};

/**
 * Project title for resume templates: shows `name`, and if `link` is set, makes the name
 * the only visible text while using `link` as href. Raw URLs are not displayed.
 */
export function ProjectLinkedTitle({
  name,
  link,
  className,
  anchorStyle,
  inheritColor = true,
}: ProjectLinkedTitleProps) {
  if (!hasWebLink(link)) {
    return <>{name}</>;
  }
  return (
    <a
      href={normalizeExternalUrl(link!)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={{
        textDecoration: "underline",
        ...(inheritColor ? { color: "inherit" } : {}),
        ...anchorStyle,
      }}
    >
      {name}
    </a>
  );
}
