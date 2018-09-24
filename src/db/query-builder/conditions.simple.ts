import { Condition } from './conditions'
import { FieldValue } from './fields'
import { IWritable, IWriter } from './writer'

export class SimpleCondition implements Condition, IWritable {
    constructor(
        public condition: string,
        public param: FieldValue[],
    ) { }

    public analyze(writer: IWriter) {
        writer.write(this)
    }
}
