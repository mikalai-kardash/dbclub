declare module '*.graphql' {
    const kind: any
    const definitions: any
    export { kind, definitions }
}

declare module 'sql-formatter' {
    declare function format(sql: string): string
    export { format }
}
