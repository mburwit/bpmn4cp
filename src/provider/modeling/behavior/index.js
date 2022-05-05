// import CalculateNameBehavior from './CalculateNameBehavior';
import ActorUpdateInterceptor from "./ActorUpdateInterceptor";

export default {
  __init__: [
    // 'calculateNameBehavior',
    'groupIntersectionBehavior'
  ],
  // calculateNameBehavior: [ 'type', CalculateNameBehavior ],
  groupIntersectionBehavior: [ 'type', ActorUpdateInterceptor ]
};
