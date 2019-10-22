export enum CommandItemType {
  FIXED = 1,
  PARAMETER,
}

export interface CommandItem {
  name: string
  type: CommandItemType
}
