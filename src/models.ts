export enum CommandItemType {
  FIXED = 1,
  PARAMETER,
}

export interface CommandItem {
  name: string
  type: CommandItemType
}

export interface StringMap {
  [key: string]: string
}

export interface StringArrayMap {
  [key: string]: string[]
}
export interface StringOrBooleanMap {
  [key: string]: string | boolean
}
