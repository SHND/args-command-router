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
}
