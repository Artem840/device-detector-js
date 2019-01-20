import { Cameras, GenericDeviceResult } from "../../typings/device";
import { variableReplacement } from "../../utils/variable-replacement";
import { userAgentParser } from "../../utils/user-agent";

const jsonpack = require("jsonpack");
const cameras: Cameras = jsonpack.unpack(require("../../../fixtures/regexes/device/cameras.json"));

export default class CameraParser {
  public parse = (userAgent: string): GenericDeviceResult => {
    const result: GenericDeviceResult = {
      type: "",
      brand: "",
      model: ""
    };

    for (const [brand, camera] of Object.entries(cameras)) {
      const match = userAgentParser(camera.regex, userAgent);

      if (!match) continue;

      result.type = "camera";
      result.brand = brand;

      if (camera.model) {
        result.model = variableReplacement(camera.model, match).trim();
      } else if (camera.models) {
        for (const model of camera.models) {
          const modelMatch = userAgentParser(model.regex, userAgent);

          if (!modelMatch) continue;

          result.model = variableReplacement(model.model, modelMatch).trim();
          break;
        }
      }
      break;
    }

    return result;
  };
}
