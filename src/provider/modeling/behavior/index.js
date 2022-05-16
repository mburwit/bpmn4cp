// import CalculateNameBehavior from './CalculateNameBehavior';
import ActorUpdateInterceptor from "./ActorUpdateInterceptor";
import LabelUpdateBehavior from "./LabelUpdateBehavior";

export default {
  __init__: [
    // 'calculateNameBehavior',
    'groupIntersectionBehavior',
    'labelUpdateBehavior'
  ],
  // calculateNameBehavior: [ 'type', CalculateNameBehavior ],
  groupIntersectionBehavior: [ 'type', ActorUpdateInterceptor ],
  labelUpdateBehavior: [ 'type', LabelUpdateBehavior ]
};
