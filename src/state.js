import * as d3 from 'd3';

const state = {
  nodes: [],
  links: [],
  sim: null,
  svgEl: null,
  gL: null,
  gLH: null,
  gN: null,
  gBadges: null,
  selId: null,
  selEdge: null,
  tr: d3.zoomIdentity,
  W: 0,
  H: 0,
  zoomBehavior: null,
  viewMode: "graph",
  lang: "en",
  density: "comfortable",
  sidebarOpen: true,
  focusMode: false,
  overlayMode: "relation",
  eraEnabled: false,
  eraYear: null,
  eraPlaying: false,
  eraTimer: null,
  loaderHidden: false,
  filterPanelOpen: false,
  onboardingComplete: false,
  minimapVisible: false
};

export default state;
