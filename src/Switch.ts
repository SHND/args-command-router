export interface SwitchParameter {
  name: string
}

export class Switch {
  public shortname?: string
  public longname?: string
  public description?: string
  public parameters?: SwitchParameter[] = []

  constructor(
    shortname?: string,
    longname?: string,
    description?: string,
    parameters: SwitchParameter[] = []
  ) {
    if (!shortname && !longname) {
      throw Error('Switch cannot be initialized with both shortname and longname not specified.');
    }

    if (shortname && shortname.length > 1) {
      throw Error(`Switch shortname "${shortname}" is longer than 1 character.`);
    }

    if (longname && longname.length <= 1) {
      throw Error(`Switch longname "${longname}" is shorter 2 characters.`);
    }

    this.shortname = shortname;
    this.longname = longname;
    this.description = description;
    this.parameters = parameters;
  }

  /**
   * shortname getter
   */
  public getShortname = () => {
    return this.shortname;
  }

  /**
   * shortname setter
   * @param {string} name
   */
  public setShortname = (name: string) => {
    this.shortname = name;
  }

  /**
   * longname getter
   */
  public getLongname = () => {
    return this.longname;
  }

  /**
   * longname setter
   * @param {string} name
   */
  public setLongname = (name: string) => {
    this.longname = name;
  }

  /**
   * description getter
   */
  public getDescription = () => {
    return this.description;
  }

  /**
   * description setter
   * @param {string} name
   */
  public setDescription = (name: string) => {
    this.description = name;
  }

  /**
   * parameters getter
   */
  public getParameters = () => {
    return this.parameters;
  }

  /**
   * parameters setter
   * @param {SwitchParameter[]} params
   */
  public setParameters = (params: SwitchParameter[]) => {
    this.parameters = params;
  }

}
