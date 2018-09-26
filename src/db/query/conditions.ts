import {
    AndCondition as And,
    Condition as Filter,
    ConditionType,
    ConditionVisitor,
    FieldType,
    OrCondition as Or,
} from './models'

export class Condition implements Filter {
    public readonly kind: 'filter'

    constructor(
        public query: string,
        public params: FieldType[],
    ) {
        this.kind = 'filter'
    }

    public accept(visitor: ConditionVisitor) {
        // ?
    }
}

export class OrCondition implements Or {
    public readonly kind: 'or'

    constructor(
        public or: ConditionType[],
    ) {
        this.kind = 'or'
    }

    public accept(visitor: ConditionVisitor) {
        // ?
    }
}

export class AndCondition implements And {
    public readonly kind: 'and'

    constructor(
        public and: ConditionType[],
    ) {
        this.kind = 'and'
    }

    public accept(visitor: ConditionVisitor) {
        // ?
    }
}
