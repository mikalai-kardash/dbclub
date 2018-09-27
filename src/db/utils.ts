import { FieldType } from './query/models'

export const toQuery = (params: FieldType[]): string => {
    return params.filter(p => p).map(_ => '?').join(', ')
}
