// lib/serverHttp.ts
import 'server-only'; // ensure this module is server-only at compile time
import axios, { type AxiosInstance } from 'axios';
import { cookies } from 'next/headers';

/**
 * Build a per-request Axios instance (Node runtime only).
 * Use only in Server Components, Route Handlers, or Server Actions.
 * If you need this in an Edge route/page, switch to `fetch` or set `export const runtime = 'nodejs'`.
 */
export async function serverHttp(): Promise<AxiosInstance> {
  const c = await cookies();

  // Some Next versions type getAll() slightly differently; this line is compatible
  const allCookies = c.getAll(); // -> Array<{ name: string; value: string }>
  const cookieHeader =
    allCookies.length > 0
      ? allCookies.map(({ name, value }) => `${name}=${value}`).join('; ')
      : '';

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (cookieHeader) headers['cookie'] = cookieHeader;

  const lang = c.get('lang')?.value;
  if (lang) headers['Accept-Language'] = String(lang);

  return axios.create({
    baseURL: process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL,
    withCredentials: true,
    headers,           // typed as Record<string, string> to satisfy Axios
    timeout: 10_000,
  });
}
