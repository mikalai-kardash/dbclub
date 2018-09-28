export type Mapper<T> =
    (record: any) => T

export type Query = Partial<{
    query: string,
    params: any[],
}>

export type AsyncQuery<T> =
    (query: Query, mapper: Mapper<T>) => Promise<T[]>
