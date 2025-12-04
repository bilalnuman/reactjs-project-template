export const ROUTES = {
    home: () => '/',
    login: { method: 'post', url: '/auth/signin/' },
    post: (id: number | string) => `/posts/${id}`,
    settings: () => '/settings',
    categories: (quey?: string|number) => ({ method: "get", url: `/v1/inventory/products/${quey??""}` }),
    me: '/auth/me'

} as const;




type RouteValueToPath<T> = T extends (...args: any) => infer R ? R : T extends readonly [any, infer P] ? P : never;

export type AppRoute = RouteValueToPath<(typeof ROUTES)[keyof typeof ROUTES]>;