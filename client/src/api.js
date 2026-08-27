const BASE_URL = process.env.REACT_APP_API_URL || "";

/**
 * Wrapper around fetch that prepends the API base URL.
 * Includes a 30s timeout to handle Render cold starts.
 */
export function apiFetch(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

  return fetch(`${BASE_URL}${path}`, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(timeout));
}
