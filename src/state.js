import * as d3 from 'd3';

const state = {
  nodes: [],
  links: [],
  sim: null,
  svgEl: null,
  gL: null,
  gN: null,
  selId: null,
  tr: d3.zoomIdentity,
  W: 0,
  H: 0,
  zoomBehavior: null,
  viewMode: "graph"
};

export default state;
