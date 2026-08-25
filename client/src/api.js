// Central API base URL
// In development: empty string (CRA proxy in package.json handles it)
// In production: set REACT_APP_API_URL to your Render backend URL
const BASE_URL = process.env.REACT_APP_API_URL || "";

/**
 * Wrapper around fetch that prepends the API base URL.
 * Supports all standard fetch options.
 */
export function apiFetch(path, options = {}) {
  return fetch(`${BASE_URL}${path}`, options);
}
