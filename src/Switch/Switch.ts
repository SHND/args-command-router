export default abstract class Switch {
  private _shortName: string | null = null
  private _longName: string | null = null
  private _description: string

  constructor(
    shortName: string | null,
    longName: string | null,
    description: string = ''
  ) {
    this._shortName = shortName
    this._longName = longName
    this._description = description
  }
}
