import { Switch } from "../../Switch";
import { Visibility } from "../../enums";
import { PathItem } from "../../PathTree/PathItem";
import { PATH_ITEM_DELIMITER } from "../../constants";
import { BlockPathItem } from "../../PathTree/BlockPathItem";
import { SpreadPathItem } from "../../PathTree/SpreadPathItem";
import { StaticPathItem } from "../../PathTree/StaticPathItem";

/**
 * Prepare help sections for command-line-usage npm package
 * @param pathItem that we want to print help for
 * @param applicationName name of the application
 */
 export function generateHelp(pathItem: PathItem, applicationName: string): object[] {
  const sections = [];
  
  const branchNames = pathItem
    .path(false)
    .split(PATH_ITEM_DELIMITER);

  sections.push({
    header: 'Name',
    content: `{${pathItem.getUniqueName(false) !== PATH_ITEM_DELIMITER ? 'dim.italic' : 'reset'} ${applicationName + branchNames.slice(0, -1).join(' ')}${branchNames[1].length === 0 ? '' : ' '}}${pathItem.getUniqueName(false) !== PATH_ITEM_DELIMITER ? pathItem.getUniqueName(false) : ''}`
  });

  if (pathItem.hasDescription()) {
    sections.push({
      header: 'Description',
      content: pathItem.getDescription()
    });
  };

  const subPathItemNames = [];

  if (pathItem instanceof BlockPathItem && pathItem.hasSpreadPathItem()) {
    if (pathItem.getSpreadPathItem().getVisibility() !== Visibility.PRIVATE) {
      const branchNames = pathItem
        .path(false)
        .split(PATH_ITEM_DELIMITER);

      subPathItemNames.push(
        `{dim.italic ${applicationName + branchNames.join(' ')}${branchNames[1].length === 0 ? '' : ' '}}${pathItem.getSpreadPathItem().getUniqueName(false)}`
      )
    }
  }
  
  if (pathItem instanceof BlockPathItem && pathItem.hasDynamicPathItem()) {
    if (pathItem.getDynamicPathItem().getVisibility() !== Visibility.PRIVATE) {
      const branchNames = pathItem
        .path(false)
        .split(PATH_ITEM_DELIMITER);

      subPathItemNames.push(
        `{dim.italic ${applicationName + branchNames.join(' ')}${branchNames[1].length === 0 ? '' : ' '}}${pathItem.getDynamicPathItem().getUniqueName(false)}`
      );
    }
  }

  if ((pathItem instanceof BlockPathItem || pathItem instanceof SpreadPathItem) && pathItem.getSwitchPathItems().length > 0) {
    const branchNames = pathItem
      .path(false)
      .split(PATH_ITEM_DELIMITER);

    subPathItemNames.push(
      ...Object.values(pathItem.getSwitchPathItems())
        .filter(subPathItem => subPathItem.getVisibility() !== Visibility.PRIVATE)
        .map(subPathItem => 
          `{dim.italic ${applicationName + branchNames.join(' ')}${branchNames[1].length === 0 ? '' : ' '}}${subPathItem.getUniqueName(false)}`
        )
    )
  }

  if (pathItem instanceof BlockPathItem) {
    const branchNames = pathItem
      .path(false)
      .split(PATH_ITEM_DELIMITER)

    subPathItemNames.push(
      ...Object.values(pathItem.getStaticPathItems())
        .filter(subPathItem => subPathItem.getVisibility() !== Visibility.PRIVATE)
        .map(subPathItem => 
          `{dim.italic ${applicationName + branchNames.join(' ')}${branchNames[1].length === 0 ? '' : ' '}}${subPathItem.getUniqueName(false)}`
        )
    )
  }

  if (subPathItemNames.length > 0) {
    sections.push({
      header: 'Commands',
      content: subPathItemNames.map(name => ({ name }))
    })
  }

  const inheritedCommonRequiredSwitches: Record<string, Switch> = {};
  Object.values(pathItem.getInheritedCommonRequiredSwitchNames()).forEach(swich => {
    const key = `${swich.getShortname()},${swich.getLongname()}`;
    if (!inheritedCommonRequiredSwitches[key]) {
      inheritedCommonRequiredSwitches[key] = swich;
    }
  });

  const inheritedCommonOptionalSwitches: Record<string, Switch> = {};
  Object.values(pathItem.getInheritedCommonOptionalSwitchNames()).forEach(swich => {
    const key = `${swich.getShortname()},${swich.getLongname()}`;
    if (!inheritedCommonOptionalSwitches[key]) {
      inheritedCommonOptionalSwitches[key] = swich;
    }
  });

  const requiredSwitches = [
    ...pathItem.getRequiredSwitches(),
    ...Object.values(inheritedCommonRequiredSwitches)
  ];

  const optionalSwitches = [
    ...pathItem.getOptionalSwitches(),
    ...Object.values(inheritedCommonOptionalSwitches)
  ];

  const requiredDefinitions = [];
  requiredDefinitions.push(...requiredSwitches.map(swich => ({
    name: swich.getLongname(),
    alias: swich.getShortname(),
    description: swich.getDescription(),
    type: swich.getParameters().length === 0 ? Boolean : undefined,
    typeLabel: swich.getParameters().length > 0 && swich.getParameters().map(param => `{underline ${param}}`).join(' ')
  })));

  const optionalDefinitions = [];
  optionalDefinitions.push(...optionalSwitches.map(swich => ({
    name: swich.getLongname(),
    alias: swich.getShortname(),
    description: swich.getDescription(),
    type: swich.getParameters().length === 0 ? Boolean : undefined,
    typeLabel: swich.getParameters().length > 0 && swich.getParameters().map(param => `{underline ${param}}`).join(' ')
  })));

  if (requiredDefinitions.length > 0) {
    sections.push({
      header: 'Required Options',
      optionList: requiredDefinitions,
    });
  }

  if (optionalDefinitions.length > 0) {
    sections.push({
      header: 'Options',
      optionList: optionalDefinitions,
    });
  }

  if (pathItem instanceof StaticPathItem && Object.keys(pathItem.getAliases()).length > 0) {
    const itemsTillParent = pathItem.getParentPathItem()
      .path(false)
      .split(PATH_ITEM_DELIMITER)

    sections.push({
      header: 'Aliases',
      content: Object.keys(pathItem.getAliases()).map(alias => ({
        name: `{dim.italic ${applicationName + itemsTillParent.join(' ')}${itemsTillParent[1].length === 0 ? '' : ' '}}${alias}`
      }))
    });
  }

  return sections;
}
