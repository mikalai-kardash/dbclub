import { ConditionKind, OrCondition as Condition } from './conditions'
import { IWritable, IWriter } from './writer'

export class OrCondition implements Condition, IWritable {
    constructor(public OR: ConditionKind[]) { }

    public analyze(writer: IWriter) {
        writer.writeOr(this)
    }
}
