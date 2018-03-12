// timeline geometry

var sortDirection = { unsorted: 0, forward : 1, reverse : 2};
// pwlTrackDomains is the 2D array that holds the piecewise linear temporal values
//  for the events in a timeline row.
// pwlTrackRanges is the 2D array that holds the piecewise linear ranges that
//  map to the correspionding pwlTrackDomains.
var pwlTrackDomains = [];
var pwlTrackRanges = [];

var timelineGeometry = {
  // The height of the timeflow pane is determined by the value of
  // - timeFlow.maxTracks this sets the maximum number of tracks that can be
  //                      viewed simultaneously on the timeflow pane.
  maxWidth: 960,    // Maximum width of the timeflow and all other panes
  infoFlowHeight: 200,    // Height of infoflow pane - width is based on timeflow pane
//  infoFlowCardWidth: 182,    // Width of infoflow cards
  // margin surrounding the three *flow panes
  margin: {top: 20 , right: 20, bottom: 20, left: 20},
  // axis geometry includes a top and bottom margin used to set off from
  // elements above and below
  axis: {labelHeight: 10, tickHeight: 6, lineStroke: 1,
    margin: {top: 1, bottom: 3}},
  // *flow geometries include a margin to set off the flow from elements above and
  // below; this is redundant for all except the birdView which needs an independent
  // margin to afford space for the brush.
  //  - maxTracks this parameter sets the limit on the number of timeline tracks
  //              that can be viewed in the pane; this is not a limit on the total
  //              tracks allowed in a session which can be greater. The value for
  //              birdView.maxTracks should always be equal or gt
  //              timeFlow.maxTracks or vertical scrolling will fail.
  // - track.height sets the height of the timeline track for the given flow.
  // - track.space sets the verticle space between adjacent timeline tracks.
  infoFlow: {maxTracks: 1, minTracks: 1, maxHeight: 2880,
    margin: {top: 0, bottom: 0},
    track: {maxHeight: 160, height: 160, space: 2},
    card: {numberInPane: 4, width: null}},
  timeFlow: {maxTracks: 17, minTracks: 3, maxHeight: 292,
    margin: {top: 3, bottom: 3},
    track: {maxHeight: 14, height: 14, space: 3}},
  birdView: {maxTracks: 17, minTracks: 17, maxHeight: 17,
    margin: {top: 1, bottom: 1},
    track: {maxHeight: 1, height: 1, space: 0}},
  // - totalTracks is reset after processing the data.
  vScroll: {margin: {left: 2, right: 2}},
  totalTracks: 0,
  fitToScale: 0.05, // The percent of full scale to use as a target for ensuring
                    // all timeline track labels are legible (w/o overlap). This
                    // value is also used to set the pad amount for the start and
                    // end of the timeline. Typically should not exceed 20%. A
                    // value of 100% will attempt to ensure all labels are legible
                    // at the fully zoomed out level which will likely cause timeline
                    // tracks to grow beyond practical use.
  instantRadius: 5,
  brushExtent: [],
  eventSortDirection: sortDirection.unsorted,
  verticalCursor: {currentTrack: null, previousTrack: null},
//  verticalCursorTrack: null,
  currentReferenceValue: null,

// flowHeight - determines the height in pixels of the named flow where flowName
// is one of ["infoFlow", "timeFlow", "birdView"].
//  - visible is boolean that returns the height of the flow that is inside the
//            visible (non-clipped) region when true and, when false, returns
//            the height of the total flow.

  flowHeight: function(flowName, visible) {
    var visibleTracks = Math.max(Math.min(this.totalTracks, this[flowName].maxTracks),
                            this[flowName].minTracks);

    // in the event that there is only 1 visible track, do not add the "space"
    // between tracks value into the height computation.

//    return this[flowName].margin.top + (this[flowName].track.height +
//      ((visibleTracks > 1) ? this[flowName].track.space : 0)) * ((visible) ?
//        visibleTracks : Math.max(this.totalTracks, this[flowName].minTracks)) -
//        this[flowName].track.space + this[flowName].margin.bottom;
    return this[flowName].margin.top + (this[flowName].track.height +
        this[flowName].track.space) * ((visible) ?
        visibleTracks : Math.max(this.totalTracks, this[flowName].minTracks)) -
        this[flowName].track.space + this[flowName].margin.bottom;

  },

  axisHeight: function( ) {
    return this.axis.labelHeight + this.axis.tickHeight + this.axis.lineStroke +
      this.axis.margin.top + this.axis.margin.bottom;
  }
}

if (timelineGeometry.birdView.maxTracks > timelineGeometry.timeFlow.maxTracks)
  console.log("WARNING: timeline geometry value out of range: Bird's eye view maxTracks should be less than or equal to timeFlow maxTracks!!!");
/*
var infoFlowCards = 5,      // number of cards visible in info pane.
    cardLateralMargin = 5,  // number of pixels between cards.
    infoFlowCardWidth = (timelineGeometry.maxWidth - timelineGeometry.margin.left -
      timelineGeometry.margin.right - (infoFlowCards - 1) * cardLateralMargin) / infoFlowCards,
    infoFlowCardHeight = 200 - timelineGeometry.margin.top - timelineGeometry.margin.bottom;
*/
var topKeys = d3.set(["label", "SideA", "SideB", "start", "end", "whereFought",
                           "loc", "Initiator", "Outcome", "SideADeaths",
                           "SideBDeaths"]);
var spatioFlow = true;

function isString (obj) {
 return (Object.prototype.toString.call(obj) === '[object String]');
}

// fcn to return the width (in pixels) of a string to be rendered on canvas.
// This fcn is used to help provide "pretty" tracks with fully readable labels
// at some prescribed zoom level.

function getTextWidth(text, font) {
    // if given, use cached canvas for better performance
    // else, create new canvas
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return Math.floor(metrics.width+1);
};

function getViewRange_ms(min, max) {
  return (isString(min)) ? (max.getTime() - min.getTime()) : max - min;
}

function updateCurrentCursorTrack(track) {
  timelineGeometry.verticalCursor.previousTrack = timelineGeometry.verticalCursor.currentTrack;
  timelineGeometry.verticalCursor.currentTrack = track;
  return;
}

function saveFile(strData, strFileName, strMimeType) {
var docReference = document,
    elementa = docReference.createElement("a"),
    mimeType = strMimeType || "text/plain";

//build download link:
//elementa.href = "data:" + mimeType + "charset=utf-8," + escape(strData);
elementa.href = "data:" + mimeType + "charset=utf-8," + encodeURIComponent(strData);

if (window.MSBlobBuilder) { // IE10
    var bb = new MSBlobBuilder();
    bb.append(strData);
    return navigator.msSaveBlob(bb, strFileName);
} /* end if(window.MSBlobBuilder) */

if ('download' in elementa) { //FF20, CH19
    elementa.setAttribute("download", strFileName);
    elementa.innerHTML = "downloading...";
    docReference.body.appendChild(elementa);
    setTimeout(function() {
        var eventME = docReference.createEvent("MouseEvents");
        eventME.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        elementa.dispatchEvent(eventME);
        docReference.body.removeChild(elementa);
    }, 66);
    return true;
}; /* end if('download' in a) */

//do iframe dataURL download: (older W3)
var iframeElement = docReference.createElement("iframe");
docReference.body.appendChild(iframeElement);
iframeElement.src = "data:" + (strMimeType ? strMimeType : "application/octet-stream") + (window.btoa ? ";base64" : "") + "," + (window.btoa ? window.btoa : escape)(strData);
setTimeout(function() {
    docReference.body.removeChild(iframeElement);
}, 333);
return true;
}