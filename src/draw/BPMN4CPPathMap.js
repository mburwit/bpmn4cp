import inherits from 'inherits';

import PathMap from 'bpmn-js/lib/draw/PathMap';
import { assign } from 'min-dash';

/**
 * Map containing SVG paths needed by BpmnRenderer.
 */

export default function BPMN4CPPathMap() {

  PathMap.call(this);
  /**
   * Contains a map of path elements
   *
   * <h1>Path definition</h1>
   * A parameterized path is defined like this:
   * <pre>
   * 'GATEWAY_PARALLEL': {
   *   d: 'm {mx},{my} {e.x0},0 0,{e.x1} {e.x1},0 0,{e.y0} -{e.x1},0 0,{e.y1} ' +
          '-{e.x0},0 0,-{e.y1} -{e.x1},0 0,-{e.y0} {e.x1},0 z',
   *   height: 17.5,
   *   width:  17.5,
   *   heightElements: [2.5, 7.5],
   *   widthElements: [2.5, 7.5]
   * }
   * </pre>
   * <p>It's important to specify a correct <b>height and width</b> for the path as the scaling
   * is based on the ratio between the specified height and width in this object and the
   * height and width that is set as scale target (Note x,y coordinates will be scaled with
   * individual ratios).</p>
   * <p>The '<b>heightElements</b>' and '<b>widthElements</b>' array must contain the values that will be scaled.
   * The scaling is based on the computed ratios.
   * Coordinates on the y axis should be in the <b>heightElement</b>'s array, they will be scaled using
   * the computed ratio coefficient.
   * In the parameterized path the scaled values can be accessed through the 'e' object in {} brackets.
   *   <ul>
   *    <li>The values for the y axis can be accessed in the path string using {e.y0}, {e.y1}, ....</li>
   *    <li>The values for the x axis can be accessed in the path string using {e.x0}, {e.x1}, ....</li>
   *   </ul>
   *   The numbers x0, x1 respectively y0, y1, ... map to the corresponding array index.
   * </p>
   *
   * RegExp: '([-+]?)([0-9]*\.?[0-9]+) ([-+]?)([0-9]*\.?[0-9]+)[ ]?' \+
   */
  this.pathMap = assign(this.pathMap, {
    'TASK_TYPE_COACH': {
      d: 'm27.992 10.417c-.108 2.335-1.739 5.536-4.894 9.596-3.262 4.238-6.023 6.361-8.283 6.361-1.397 0-2.583-1.289-3.548-3.872-.647-2.367-1.289-4.735-1.936-7.102-.717-2.583-1.486-3.872-2.311-3.872-.178 0-.806.38-1.885 1.13l-1.13-1.453c1.186-1.04 2.354-2.081 3.502-3.121 1.579-1.364 2.766-2.081 3.558-2.156 1.865-.178 3.019 1.097 3.45 3.829.464 2.948.788 4.781.971 5.498.539 2.447 1.13 3.671 1.777 3.671.502 0 1.256-.792 2.264-2.381 1.003-1.585 1.542-2.794 1.617-3.623.145-1.369-.394-2.058-1.617-2.058-.577 0-1.167.131-1.777.394 1.181-3.863 3.431-5.738 6.759-5.63 2.461.065 3.623 1.664 3.483 4.791z',
    },
    'TASK_TYPE_GAME': {
      d: 'm24.8 24h-12.8c-2.2 0-4-1.8-4-4v-12.8c0-2.2 1.8-4 4-4h12.8c2.2 0 4 1.8 4 4v12.8c0 2.2-1.8 4-4 4zm-11.2-17.6c-1.326 0-2.4 1.075-2.4 2.4s1.075 2.4 2.4 2.4 2.4-1.075 2.4-2.4-1.075-2.4-2.4-2.4zm0 9.6c-1.326 0-2.4 1.075-2.4 2.4s1.075 2.4 2.4 2.4 2.4-1.075 2.4-2.4-1.075-2.4-2.4-2.4zm4.8-4.8c-1.325 0-2.4 1.075-2.4 2.4s1.075 2.4 2.4 2.4 2.4-1.075 2.4-2.4-1.075-2.4-2.4-2.4zm4.8-4.8c-1.326 0-2.4 1.075-2.4 2.4s1.075 2.4 2.4 2.4 2.4-1.075 2.4-2.4-1.075-2.4-2.4-2.4zm0 9.6c-1.326 0-2.4 1.075-2.4 2.4s1.075 2.4 2.4 2.4 2.4-1.075 2.4-2.4-1.075-2.4-2.4-2.4zm.719 9.6c-.373 1.82-1.993 3.2-3.919 3.2h-12.8c-2.2 0-4-1.8-4-4v-12.8c0-1.926 1.38-3.546 3.2-3.919v15.919c0 .88.72 1.6 1.6 1.6h15.919z',
    },
    'QI': {
      d: 'm ' +
        '{mx},{my} ' +
        'm ' +
        '{e.x1},{e.y1} ' +
        'c ' +
        '-{e.x2},-{e.y2} ' +
        '-{e.x3},-{e.y3} ' +
        '-{e.x4},-{e.y4} ' +
        'c ' +
        '-{e.x5},{e.y5} ' +
        '-{e.x6},{e.y6} ' +
        '-{e.x7},{e.y7} ' +
        'c ' +
        '-{e.x8},{e.y8} ' +
        '-{e.x9},{e.y9} ' +
        '-{e.x10},{e.y10} ' +
        'c ' +
        '{e.x11},{e.y11} ' +
        '{e.x12},{e.y12} ' +
        '{e.x13},{e.y13} ' +
        'c ' +
        '{e.x14},{e.y14} ' +
        '{e.x15},{e.y15} ' +
        '{e.x16},{e.y16} ' +
        'c ' +
        '{e.x17},{e.y17} ' +
        '{e.x18},{e.y18} ' +
        '{e.x19},{e.y19} ' +
        'c ' +
        '{e.x20},{e.y20} ' +
        '{e.x21},{e.y21} ' +
        '{e.x22},{e.y22} ' +
        'c ' +
        '{e.x23},{e.y23} ' +
        '{e.x24},{e.y24} ' +
        '{e.x25},{e.y25} ' +
        'c ' +
        '{e.x26},{e.y26} ' +
        '-{e.x27},-{e.y27} ' +
        '-{e.x28},-{e.y28} ' +
        'c ' +
        '{e.x29},-{e.y29} ' +
        '{e.x30},-{e.y30} ' +
        '{e.x31},-{e.y31} ' +
        'c ' +
        '{e.x32},-{e.y32} ' +
        '{e.x33},-{e.y33} ' +
        '{e.x34},-{e.y34} ' +
        'c ' +
        '{e.x35},-{e.y35} ' +
        '-{e.x36},-{e.y36} ' +
        '-{e.x37},-{e.y37} ' +
        'z' +
        'm ' +
        '-{e.x38},{e.y38} ' +
        'c ' +
        '{e.x39},-{e.y39} ' +
        '{e.x40},-{e.y40} ' +
        '{e.x41},-{e.y41} ' +
        'c ' +
        '{e.x42},{e.y42} ' +
        '{e.x43},{e.y43} ' +
        '{e.x44},{e.y44} ' +
        'c ' +
        '{e.x45},{e.y45} ' +
        '-{e.x46},{e.y46} ' +
        '-{e.x47},{e.y47} ' +
        'c ' +
        '-{e.x48},{e.y48} ' +
        '-{e.x49},-{e.y49} ' +
        '-{e.x50},-{e.y50} ' +
        'c ' +
        '-{e.x51},-{e.y51} ' +
        '-{e.x52},-{e.y52} ' +
        '-{e.x53},-{e.y53} ' +
        'c ' +
        '{e.x54},-{e.y54} ' +
        '{e.x55},-{e.y55} ' +
        '{e.x56},-{e.y56} ' +
        'z' +
        'm ' +
        '{e.x57},{e.y57} ' +
        'c ' +
        '{e.x58},{e.y58} ' +
        '{e.x59},-{e.y59} ' +
        '{e.x60},-{e.y60} ' +
        'c ' +
        '{e.x61},{e.y61} ' +
        '-{e.x62},{e.y62} ' +
        '-{e.x63},{e.y63} ' +
        'c ' +
        '{e.x64},{e.y64} ' +
        '{e.x65},{e.y65} ' +
        '{e.x66},{e.y66} ' +
        'c ' +
        '{e.x67},{e.y67} ' +
        '{e.x68},{e.y68} ' +
        '{e.x69},{e.y69} ' +
        'z',
      height: 36,
      width: 36,
      heightElements: [
        0,
        12.899,
        1.183,
        1.774,
        1.774,
        0,
        0.588,
        1.76,
        1.172,
        2.87,
        5.094,
        2.224,
        3.929,
        5.119,
        1.186,
        1.777,
        1.777,
        0,
        0,
        0,
        0,
        3.094,
        3.094,
        0,
        0,
        0,
        0,
        3.689,
        3.689,
        0.495,
        1.272,
        2.334,
        1.062,
        2.378,
        3.953,
        2.214,
        3.915,
        5.094,
        1.705,
        0.76,
        1.142,
        1.142,
        0,
        1.513,
        4.531,
        3.018,
        4.524,
        4.524,
        0,
        0.378,
        1.138,
        0.76,
        1.887,
        3.386,
        1.499,
        2.626,
        3.389,
        9.927,
        0,
        13.406,
        13.406,
        0,
        0,
        0,
        0,
        13.406,
        13.406,
        0,
        0,
        0],
      widthElements: [
        0,
        19.699,
        1.079,
        2.637,
        4.672,
        2.038,
        3.602,
        4.695,
        1.09,
        1.633,
        1.633,
        0,
        0.543,
        1.633,
        1.086,
        2.647,
        4.678,
        0,
        0.21,
        0.21,
        0,
        2.427,
        2.427,
        0,
        3.599,
        3.599,
        0,
        3.19,
        3.19,
        1.069,
        1.88,
        2.434,
        0.553,
        0.831,
        0.831,
        0,
        0.539,
        1.622,
        7.209,
        0.571,
        1.417,
        2.537,
        2.231,
        3.345,
        3.345,
        0,
        1.121,
        3.369,
        1.117,
        1.956,
        2.516,
        0.564,
        0.846,
        0.846,
        0,
        0.282,
        0.849,
        14.4,
        0,
        0,
        0,
        0,
        2.808,
        2.808,
        0,
        0,
        0,
        0,
        2.808,
        2.808
      ],
    },
    'OBSERVATION_FEATURE': {
      d: 'm ' +
        '{mx},{my} ' +
        'm ' +
        '{e.x0},-{e.y0} ' +
        'c ' +
        '{e.x1},0 ' +
        '{e.x2},{e.y1} ' +
        '{e.x3},{e.y2} ' +
        '0,{e.y3} ' +
        '-{e.x4},{e.y4} ' +
        '-{e.x5},{e.y5} ' +
        'h ' + '-{e.x6} ' +
        'c ' +
        '-{e.x7},-{e.y6} ' +
        '-{e.x8},-{e.y7} ' +
        '-{e.x9},-{e.y8} ' +
        '0,-{e.y9} ' +
        '{e.x10},-{e.y10} ' +
        '{e.x11},-{e.y11} ' +
        'z ' +
        'm ' +
        '{e.x12},{e.y12} ' +
        'c ' +
        '{e.x13},-{e.y13} ' +
        '{e.x14},-{e.y14} ' +
        '{e.x15},-{e.y15} ' +
        'h ' + '-{e.x16} ' +
        'v ' + '-{e.y16} ' +
        'h ' + '{e.x17} ' +
        'c ' +
        '-{e.x18},-{e.y17} ' +
        '-{e.x19},-{e.y18} ' +
        '-{e.x20},-{e.y19} ' +
        'h ' + '-{e.x21} ' +
        'v ' + '-{e.y20} ' +
        'h ' + '{e.x22} ' +
        'c ' +
        '-{e.x23},-{e.y21} ' +
        '-{e.x24},-{e.y22} ' +
        '-{e.x25},-{e.y23} ' +
        '-{e.x26},-{e.y24} ' +
        '-{e.x27},-{e.y25} ' +
        '-{e.x28},-{e.y26} ' +
        'v ' + '{e.y27} ' +
        'h ' + '-{e.x29} ' +
        'v ' + '-{e.y28} ' +
        'c ' +
        '-{e.x30},-{e.y29} ' +
        '-{e.x31},-{e.y30} ' +
        '-{e.x32},-{e.y31} ' +
        's ' +
        '-{e.x33},{e.y32} ' +
        '-{e.x34},{e.y33} ' +
        'v ' + '{e.y34} ' +
        'h ' + '-{e.x35} ' +
        'v ' + '-{e.y35} ' +
        'c ' +
        '-{e.x36},{e.y36} ' +
        '-{e.x37},{e.y37} ' +
        '-{e.x38},{e.y38} ' +
        '-{e.x39},{e.y39} ' +
        '-{e.x40},{e.y40} ' +
        '-{e.x41},{e.y41} ' +
        'h ' + '{e.x42} ' +
        'v ' + '{e.y42} ' +
        'h ' + '-{e.x43} ' +
        'c ' +
        '-{e.x44},{e.y43} ' +
        '-{e.x45},{e.y44} ' +
        '-{e.x46},{e.y45} ' +
        'h ' + '{e.x47} ' +
        'v ' + '{e.y46} ' +
        'h ' + '-{e.x48} ' +
        'c ' +
        '0,{e.y47} ' +
        '{e.x49},{e.y48} ' +
        '{e.x50},{e.y49} ' +
        '{e.x51},{e.y50} ' +
        '{e.x52},{e.y51} ' +
        '{e.x53},{e.y52} ' +
        'h ' + '{e.x54} ' +
        'l ' +
        '{e.x55},-{e.y53} ' +
        'h ' + '{e.x56} ' +
        'l ' +
        '{e.x57},{e.y54} ' +
        'h ' + '{e.x58} ' +
        'c ' +
        '{e.x59},-{e.y55} ' +
        '{e.x60},-{e.y56} ' +
        '{e.x61},-{e.y57} ' +
        'z',
      height: 36,
      width: 36,
      heightElements: [
        34.26,
        7.765,
        17.344,
        6.531,
        12.218,
        15.176,
        2.958,
        8.645,
        15.176,
        9.579,
        17.344,
        17.344,
        27.165,
        2.623,
        6.111,
        9.821,
        2.168,
        1.524,
        2.986,
        4.336,
        2.168,
        0.398,
        0.782,
        1.149,
        1.566,
        2.711,
        3.381,
        2.362,
        2.881,
        0.111,
        0.168,
        0.168,
        0.057,
        0.168,
        2.881,
        2.362,
        0.669,
        1.815,
        3.381,
        0.366,
        0.75,
        1.149,
        2.168,
        1.35,
        2.812,
        4.336,
        2.168,
        3.71,
        7.198,
        9.821,
        0.363,
        0.702,
        1.019,
        17.344,
        17.344,
        0.317,
        0.656,
        1.019],
      widthElements: [
        18,
        9.579,
        17.344,
        17.344,
        3.61,
        8.943,
        16.802,
        5.333,
        8.943,
        8.943,
        7.765,
        17.344,
        9.821,
        2.623,
        4.068,
        4.068,
        3.049,
        2.881,
        0.238,
        0.725,
        1.442,
        3.607,
        2.178,
        0.32,
        0.662,
        1.029,
        1.566,
        3.44,
        5.485,
        2.168,
        0.711,
        1.435,
        2.168,
        1.457,
        2.168,
        2.168,
        2.045,
        3.919,
        5.485,
        0.366,
        0.709,
        1.029,
        2.178,
        3.607,
        0.717,
        1.204,
        1.442,
        2.881,
        3.049,
        1.445,
        4.068,
        0.363,
        0.743,
        1.137,
        6.516,
        1.239,
        1.858,
        1.239,
        6.516,
        0.394,
        0.774,
        1.137],
    },
    'GOAL_STATE': {
      d: 'm 0,{e.y7} ' +
        'h {e.x0} ' +
        'A {e.x6},{e.y6} 0 0 1 {e.x7},{e.y0} ' +
        'v -{e.y0} ' +
        'h {e.x1} ' +
        'v {e.y0} ' +
        'A {e.x6},{e.y6} 0 0 1 {e.x12},{e.y7} ' +
        'h {e.x0} ' +
        'v {e.y1} ' +
        'h -{e.x0} ' +
        'A {e.x6},{e.y6} 0 0 1 {e.x8},{e.y12} ' +
        'v {e.y0} ' +
        'h -{e.x1} ' +
        'v -{e.y0} ' +
        'A {e.x6},{e.y6} 0 0 1 {e.x0},{e.y9} ' +
        'h -{e.x0} ' +
        'v -{e.y1} ' +
        'z ' +
        'm {e.x2},0' +
        'h {e.x1} ' +
        'A {e.x2},{e.y2} 0 0 1 {e.x7},{e.y4} ' +
        'v -{e.y1} ' +
        'A {e.x4},{e.y4} 0 0 0 {e.x2},{e.y7} ' +
        'z ' +
        'm {e.x5},-{e.y3}' +
        'v {e.y1} ' +
        'A {e.x2},{e.y2} 0 0 1 {e.x10},{e.y7} ' +
        'h {e.x1} ' +
        'A {e.x4},{e.y4} 0 0 0 {e.x8},{e.y2} ' +
        'z ' +
        'm {e.x3},{e.y5}' +
        'h -{e.x1} ' +
        'A {e.x2},{e.y2} 0 0 1 {e.x8},{e.y10} ' +
        'v {e.y1} ' +
        'A {e.x4},{e.y4} 0 0 0 {e.x11},{e.y9} ' +
        'z ' +
        'm -{e.x5},{e.y3}' +
        'v -{e.y1} ' +
        'A {e.x2},{e.y2} 0 0 1 {e.x4},{e.y9} ' +
        'h -{e.x1} ' +
        'A {e.x4},{e.y4} 0 0 0 {e.x7},{e.y11} ' +
        'z ' +
        'm -{e.x13},-{e.y4}' +
        'A {e.x0},{e.y0} 0 0 0 {e.x9},{e.y8} ' +
        'A {e.x0},{e.y0} 0 0 0 {e.x6},{e.y8} ' +
        'z',
      height: 36,
      width: 36,
      heightElements: [3, 4, 7, 9, 11, 13, 15, 16, 18, 20, 25, 29, 33],
      widthElements: [3, 4, 7, 9, 11, 13, 15, 16, 20, 21, 25, 29, 33, 1],
    },
  });

}

inherits(BPMN4CPPathMap, PathMap);
