import { Visibility } from "../../enums";
import { matchCommands } from "../../utility";
import { PathTree } from "../../PathTree/PathTree";
import { BlockPathItem } from "../../PathTree/BlockPathItem";

/**
 * By giving a instance of PathTree and an array of commands, this will returns suggestions
 * @param tree PathTree instance
 * @param commands array of strings representing commands
 * @returns array of suggestions
 */
export function shellSuggestions(tree: PathTree, commands: string[]) {
  const output = [];
  const root = tree.getRoot();

  const targetPathItem = matchCommands(commands, root);

  if (targetPathItem instanceof BlockPathItem) {
    for (const staticPathItem of Object.values(targetPathItem.getStaticPathItems())) {
      if (staticPathItem.getVisibility() !== Visibility.PRIVATE) {
        output.push(staticPathItem.getUniqueName(true));

        output.push(...Object.keys(staticPathItem.getAliases()));  
      }
    }
  }

  output.sort();

  return output;
}
