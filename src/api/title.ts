import { Title } from '../db/models'
import { getEmployeesTitle } from '../db/title'
import { createDefault } from '../optimizations/loader.factory'
import { Memory } from '../optimizations/memory'
import { ApiOf } from './models'

const getById = createDefault(getEmployeesTitle, (id, t) => id === t.emp_no)

export class TitleApi {

    public getTitleByEmployeeId = this.memory.single(
        async (id: number) => {
            return await getById.load(id)
        },
        {
            getFuncKey(id: number) {
                return `api/titles/getTitleByEmployeeId/${id}`
            },
            getKey(title: Title) {
                return `titles/${title.emp_no}/${title.from_date}`
            },
        },
    )

    constructor(private memory: Memory) { }
}

export type TitleApiSpec = ApiOf<TitleApi>
