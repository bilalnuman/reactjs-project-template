import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
  type QueryKey,
  type QueryClient,
  type UseQueryResult,
} from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import Cookies from "js-cookie";
import api from '@/lib/http';
import { toast } from 'react-toastify';
type HttpError = AxiosError<any>;
type QueryParams = Record<string, any> | void;
type MutMethod = 'post' | 'put' | 'patch' | 'delete';

function buildKey(url: string, key?: readonly unknown[], params?: QueryParams): QueryKey {
  const base = key && key.length ? [...key] : [url];
  return params === undefined ? base : [...base, params];
}
function isQueryOptions<TData>(
  v: unknown
): v is Omit<UseQueryOptions<TData, HttpError, TData, QueryKey>, 'queryKey' | 'queryFn'> {
  if (!v || typeof v !== 'object') return false;
  const k = v as Record<string, unknown>;
  return (
    'enabled' in k ||
    'select' in k ||
    'staleTime' in k ||
    'gcTime' in k ||
    'placeholderData' in k ||
    'refetchOnWindowFocus' in k ||
    'retry' in k
  );
}
export function useApiGet<TData, TParams extends QueryParams = void>(
  key: readonly unknown[],
  url: string,
  params?: TParams,
  options?: Omit<UseQueryOptions<TData, HttpError, TData, QueryKey>, 'queryKey' | 'queryFn'>
): UseQueryResult<TData, HttpError>;
export function useApiGet<TData, TParams extends QueryParams = void>(
  url: string,
  params?: TParams,
  options?: Omit<UseQueryOptions<TData, HttpError, TData, QueryKey>, 'queryKey' | 'queryFn'>
): UseQueryResult<TData, HttpError>;
export function useApiGet<TData>(
  url: string,
  options?: Omit<UseQueryOptions<TData, HttpError, TData, QueryKey>, 'queryKey' | 'queryFn'>
): UseQueryResult<TData, HttpError>;
export function useApiGet<TData, TParams extends QueryParams = void>(
  a: readonly unknown[] | string,
  b?:
    | string
    | TParams
    | Omit<UseQueryOptions<TData, HttpError, TData, QueryKey>, 'queryKey' | 'queryFn'>,
  c?:
    | TParams
    | Omit<UseQueryOptions<TData, HttpError, TData, QueryKey>, 'queryKey' | 'queryFn'>,
  d?: Omit<UseQueryOptions<TData, HttpError, TData, QueryKey>, 'queryKey' | 'queryFn'>
): UseQueryResult<TData, HttpError> {
  const customKey = Array.isArray(a) ? (a as readonly unknown[]) : undefined;
  if (customKey) {
    const url = b as string;
    const maybeParams = c as TParams | undefined;
    const options = d as Omit<
      UseQueryOptions<TData, HttpError, TData, QueryKey>,
      'queryKey' | 'queryFn'
    > | undefined;

    const queryKey = buildKey(url, customKey, maybeParams);
    return useQuery<TData, HttpError, TData, QueryKey>({
      queryKey,
      queryFn: async () => (await api.get<TData>(url, { params: maybeParams as any })).data,
      ...options,
    });
  }
  const url = a as string;
  if (isQueryOptions<TData>(b)) {
    const options = b;
    const queryKey = buildKey(url, undefined, undefined);
    return useQuery<TData, HttpError, TData, QueryKey>({
      queryKey,
      queryFn: async () => (await api.get<TData>(url)).data,
      ...options,
    });
  }
  const params = b as TParams | undefined;
  const options = c as Omit<
    UseQueryOptions<TData, HttpError, TData, QueryKey>,
    'queryKey' | 'queryFn'
  > | undefined;

  const queryKey = buildKey(url, undefined, params);
  return useQuery<TData, HttpError, TData, QueryKey>({
    queryKey,
    queryFn: async () => (await api.get<TData>(url, { params: params as any })).data,
    ...options,
  });
}

type MutationArgs<TBody, TParams> = {
  body?: TBody;
  params?: TParams;
};

type RevalidateObj = { key: QueryKey; action?: 'invalidate' | 'refetch'; exact?: boolean };
type RevalidateItem = QueryKey | RevalidateObj;

type RevalidateConfig<TData, TBody, TParams> =
  | RevalidateItem[]
  | ((data: TData, vars: MutationArgs<TBody, TParams>) => RevalidateItem[]);

type PrefetchConfig =
  | ((qc: QueryClient) => void | Promise<void>)
  | Array<(qc: QueryClient) => void | Promise<void>>;

type ExtraOptions<TData, TErr, TBody, TParams> = {
  revalidate?: RevalidateConfig<TData, TBody, TParams>;
  prefetch?: PrefetchConfig;
} & Omit<UseMutationOptions<TData, TErr, MutationArgs<TBody, TParams>>, 'mutationFn'>;
function normalizeRevalidates(items?: RevalidateItem[]): RevalidateObj[] {
  if (!items?.length) return [];
  return items.map((it) => {
    if (Array.isArray(it)) {
      return { key: it, action: 'invalidate', exact: false };
    }
    const obj = it as RevalidateObj;
    return { key: obj.key, action: obj.action ?? 'invalidate', exact: obj.exact ?? false };
  });
}

export function useApiMutation<
  TData,
  TBody = unknown,
  TParams extends Record<string, any> | void = void,
  TErr = HttpError,
  M extends MutMethod = 'post'
>(
  method: M,
  url: string,
  options?: ExtraOptions<TData, TErr, TBody, TParams>
) {
  const qc = useQueryClient();

  return useMutation<TData, TErr, MutationArgs<TBody, TParams>>({
    mutationFn: async ({ body, params }) => {
      switch (method) {
        case 'post': return (await api.post<TData>(url, body, { params })).data;
        case 'put': return (await api.put<TData>(url, body, { params })).data;
        case 'patch': return (await api.patch<TData>(url, body, { params })).data;
        case 'delete': return (await api.delete<TData>(url, { params, data: body as any })).data;
      }
    },
    ...options,

    onSuccess: async (data:any, variables, context) => {
      try {
        const msg = (data as any)?.message;
        const token=data?.data.access_token
        if (msg) toast.success(msg, { toastId: 'success-message' });
        if (url === "/auth/signin/" && token) {
          console.log(data)
          Cookies.set("access_token", token, {
          expires: 7,
          secure: true,
          sameSite: "strict"
        });
        }
      } catch { }
      const userOnSuccess = options?.onSuccess as
        | ((d: TData, v: MutationArgs<TBody, TParams>, c: unknown) => unknown)
        | undefined;
      await userOnSuccess?.(data, variables, context as unknown);
      const normalized = normalizeRevalidates(
        typeof options?.revalidate === 'function'
          ? options.revalidate(data, variables)
          : options?.revalidate
      );

      for (const { key, action = 'invalidate', exact = false } of normalized) {
        if (action === 'refetch') {
          await qc.refetchQueries({ queryKey: key, exact, type: 'all' });
        } else {
          await qc.invalidateQueries({ queryKey: key, exact });
        }
      }
      const prefetchers = options?.prefetch
        ? Array.isArray(options.prefetch) ? options.prefetch : [options.prefetch]
        : [];
      for (const pf of prefetchers) await pf(qc);
    },

    onError: async (err, vars, ctx) => {
      try {
        const msg = (err as any)?.response?.data?.message;
        if (msg) toast.error(msg, { toastId: 'error-message' });
      } catch { }
      const userOnError = options?.onError as
        | ((e: TErr, v: MutationArgs<TBody, TParams>, c: unknown) => unknown)
        | undefined;
      await userOnError?.(err as TErr, vars, ctx as unknown);
    },
  });
}
