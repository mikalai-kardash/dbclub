import { FieldValue } from './fields'
import { IWritable } from './writer'

export interface Condition extends IWritable {
    condition: string
    param: FieldValue[]
}

export interface AndCondition extends IWritable {
    AND: ConditionKind[]
}

export interface OrCondition extends IWritable {
    OR: ConditionKind[]
}

export type ConditionKind = Condition | AndCondition | OrCondition
