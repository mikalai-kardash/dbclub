import { getEmployee } from '../db/employee'
import { Employee } from '../schema/models'

const tableName = 'employees'
const employeeFields = [
    'id',
    'firstName',
    'lastName',
]

interface WhereInput {
    AND?: WhereInput[]
    OR?: WhereInput[]
}

interface Args {
    where?: WhereInput
}

interface Query {
    query: string
    parameters: any[]
}

// table name
// table fields
// mapper - table fields > schema fields
// mapper - query records > table fields

// schema type name
// schema fields
// schema fields => table fields
// table fields => schema fields

const buildQuery = (args: Args): string => {
    let query = `SELECT * FROM ${tableName}`

    if (args.where) {
        const condition = employeeFields
            .map(s => ({
                field: s,
                value: args.where[s],
            }))
            .find(f => f.value)

        if (condition) {
            query += ` WHERE ${condition.field} = ?`
        }
    }

    return query
}

interface Entity {
    __collection: string
}

type Func<T> = (...args: any[]) => T[]
type Index<T> = (data: T, index?: number) => any
type AsyncFunc<T> = (...args: any[]) => PromiseLike<T[]>

class EntityCache<T extends Entity> {
    private func = new Map()
    private data = new Map()

    public cache(fn: Func<T>, indexFn?: Index<T>): Func<T> {
        return (...args: any[]) => {
            const cached = this.getCachedResult(fn)
            if (cached) { return cached }
            return this.saveFuncResult(fn, fn(args), indexFn)
        }
    }

    public cacheAsync(fn: AsyncFunc<T>, indexFn?: Index<T>): AsyncFunc<T> {
        return async (...args: any[]) => {
            const cached = this.getCachedResult(fn)
            if (cached) { return cached }
            return this.saveFuncResult(fn, await fn(args), indexFn)
        }
    }

    private getCachedResult(fn: any): T[] {
        if (this.func.has(fn)) {
            return this.func.get(fn)
        }
        return undefined
    }

    private saveFuncResult(fn: any, result: T[], indexFn?: Index<T>): T[] {
        this.func.set(fn, result)
        this.saveCollection(result, indexFn)
        return result
    }

    private saveCollection(result: T[], indexFn?: Index<T>): void {
        if (!indexFn) { return }

        result.filter(r => r).map(r => ({
            key: indexFn(r),
            value: r,
        })).forEach(p => {
            this.data.set(`${p.value.__collection}/${p.key}`, p.value)
        })
    }
}

const resolveEmployee = async (_parent: any, _args: any, _context: any, _info: any): Promise<Employee> => {
    console.log(JSON.stringify(_context, null, 2))
    const employee = await getEmployee()
    return {
        id: employee.emp_no,
        firstName: employee.first_name,
        lastName: employee.last_name,
        __typeName: 'Employee',
    }
}

export default {
    employee: resolveEmployee,
}
