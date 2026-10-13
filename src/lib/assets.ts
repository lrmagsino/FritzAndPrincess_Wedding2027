const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefixes a public asset path with the deployment base path (GitHub Pages). */
export function asset(path: string): string {
  return `${basePath}${path}`;
}
