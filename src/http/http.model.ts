// Should be uppercase, because e.g this browser issue: https://github.com/axios/axios/issues/26
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD'

export type HttpStatusFamily = 5 | 4 | 3 | 2 | 1

export const HTTP_METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD']
