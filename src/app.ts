import flowMap from "./config/flowMap";
import FlowManagerService from "./services/FlowManagerService";

const flowManagerObj = new FlowManagerService(flowMap);

flowManagerObj.listen();

flowManagerObj.emit("websiteSignup", "me@gazar.dev");
flowManagerObj.emit("socksPurchased", "me@gazar.dev");

flowManagerObj.start();
