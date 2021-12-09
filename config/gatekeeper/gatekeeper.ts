import { Helpers } from "@quantfive/js-web-config";
import API from "~/config/api";

export default function gatekeeper(
  application: string,
  _accountEmail: string,
  setResult: Function
): void {
  fetch(API.GATEKEEPER_CURRENT_USER({ type: application }), API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((result: any): void => {
      setResult(result);
    })
    .catch((_error: Error): void => {
      setResult(false);
    });
}
