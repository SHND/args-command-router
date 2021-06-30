import Application from "../../Application";
/**
 * plugin tree will add a route to print application tree on console
 * @param route you want the tree callback be set to
 * @returns Plugin
 */
export function tree(route: string) {
  return function tree(app: Application) {
    app.route(route)
      .callback(function() {
        console.log(app.tree().toString());
      });
  }
}
