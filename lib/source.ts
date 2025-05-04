// ./lib/source.ts

import { icons } from "lucide-react";
import { createElement } from "react";

// Utility to render an icon by name
export function renderIcon(iconName: string) {
  if (iconName && iconName in icons) {
    return createElement(icons[iconName as keyof typeof icons]);
  }
  return null;
}
