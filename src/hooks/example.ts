import { STOP } from "../constants";
import { PathItem } from "../PathTree/PathItem";
import { PathTree } from "../PathTree/PathTree";
import { CallbackInput, CallbackReturnType, Config } from "../types";

/**
 * exampleHook function can be used as a hook.
 * 
 * @param this refers to PathItem which help is getting run on
 * @param inputs passed to the application in runtime
 * @param config Application configuration
 * @param tree PathTree
 */
 export function exampleHook(this: PathItem, inputs: CallbackInput, config: Config, tree: PathTree): CallbackReturnType {
  console.log('exampleHook is called');
  
  return STOP;
}
