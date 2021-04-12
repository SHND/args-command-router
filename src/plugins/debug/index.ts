import Application from "../../Application";
/**
 * plugin debug will add a route to print application tree on console
 * @param route you want the debug callback be set to
 * @returns Plugin
 */
export function debug(route: string) {
  return function debug(app: Application) {
    app.route(route)
      .callback(function() {
        console.log(app.tree().toString());
      });
  }
}
