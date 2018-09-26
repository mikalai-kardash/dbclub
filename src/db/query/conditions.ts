import {
    AndCondition as And,
    Condition as Filter,
    ConditionType,
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
}

export class OrCondition implements Or {
    public readonly kind: 'or'

    constructor(
        public or: ConditionType[],
    ) {
        this.kind = 'or'
    }
}

export class AndCondition implements And {
    public readonly kind: 'and'

    constructor(
        public and: ConditionType[],
    ) {
        this.kind = 'and'
    }
}
