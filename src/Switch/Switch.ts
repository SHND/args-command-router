export default abstract class Switch {
  private _shortName: string | null = null
  private _longName: string | null = null
  private _description: string

  constructor(
    shortName: string | null,
    longName: string | null,
    description: string = ''
  ) {
    shortName = shortName || null // For empty string
    longName = longName || null // For empty string

    if (!shortName && !longName)
      throw Error(
        'At least one of the Switch shortName or longName should be set.'
      )

    this._shortName = shortName
    this._longName = longName
    this._description = description
  }

  get shortname(): string | null {
    return this._shortName
  }

  get longname(): string | null {
    return this._longName
  }

  get description(): string {
    return this._description
  }
}
