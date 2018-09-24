import { AndCondition as Condition, ConditionKind } from './conditions'
import { IWritable, IWriter } from './writer'

export class AndCondition implements Condition, IWritable {
    constructor(public AND: ConditionKind[]) { }

    public analyze(writer: IWriter) {
        writer.writeAnd(this)
    }
}
