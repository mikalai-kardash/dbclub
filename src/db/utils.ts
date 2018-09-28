import { FieldType } from './query/models'

export const toQuery = (params: FieldType[]): string => {
    return params.filter(p => p).map(_ => '?').join(', ')
}

export const groupBy = <T, K extends keyof T>(arr: T[], key: K): Array<{ id: T[K], arr: T[] }> => {
    interface ReturnType { id: T[K], arr: T[] }

    const map = new Map<T[K], T[]>()

    arr.forEach(item => {
        const id = item[key]
        if (!id) { return }

        const group = map.get(id) || []
        if (group.length === 0) {
            map.set(id, group)
        }

        group.push(item)
    })

    const result: ReturnType[] = []

    for (const [id, values] of map) {
        result.push({ id, arr: values })
    }

    return result
}
