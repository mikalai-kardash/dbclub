export type ApiOf<T> = {
    // tslint:disable-next-line:ban-types
    [K in keyof T]: T[K] extends Function ? T[K] : never
}
