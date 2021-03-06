/**
 * @fileoverview Variables, objects, and functions that are
 * used globally throughout this application.
 * @author John Harkins <johnny.hark@gmail.com> on behalf of the US Government
 * @license This work is released into the public domain by the US Government.
 */
// timeline geometry

/**
* @description Enum for temporal sort direction.
* @global
* @readonly
* @enum {number}
*/
var sortDirection = {
 /** 0 = unsorted */
 unsorted: 0,
 /** 1 = forward */
 forward : 1,
 /** 2 = reverse */
 reverse : 2};

/**
* @description 2D array that holds the piecewise linear temporal values
* for the events in a timeline row. This array is used to set the
* d3.time.scale().domain property that is used with the d3.time.scale().range
* property to compute the rate of motion for info-flow cards as the timeline
* scrubber is moved. Each card moves at a rate proportional to the card's
* width over the entity duration.
* @global
*/
var pwlTrackDomains = [];

/**
* @description 2D array that holds the piecewise linear ranges that map to
* for the events in a timeline row. This array is used to set the
* d3.time.scale().range property that is used with the d3.time.scale().domain
* property to compute the rate of motion for info-flow cards as the timeline
* scrubber is moved. Each card moves at a rate proportional to the card's
* width over the entity duration.
* @global
*/
var pwlTrackRanges = [];

var fileList = [];
var fileData = null;
var configData = [];
var csblLogString = null;
var csblFileKeys = null;

var symbolsUnicode = {
  diamond: '\u2666',
  ballotBox: '\u25A3',
  ballotBox2: '\u2610',
  pushButtonOff: '\u{1F532}',
  pushButtonOn: '\u{1F533}',
  lightVerticle: '\u2502',
  heavyVerticle: '\u2503',
  lightHorizontal: '\u2500',
  heavyHorizontal: '\u2501',
  lightDashedHorizontal: '\u2508',
  heavyDashedHorizontal: '\u2509',
}

var translationTable = {
  headings: [{key: "dataField", title: "Data Field"},
             {key: "infocard", title: '<span class="i fa pficon-info"></span>'},
             //{key: "infocard", title: "+ Info Card"},
             {key: "sampleTyp", title: "Sample A"},
             {key: "sampleATyp", title: "Sample B"},
             {key: "format", title: "Kind"},
             {key: "accuracy", title: "Accuracy"}]
};
var tabSettings = {};
var statusFieldSeparator = " " + symbolsUnicode.lightDashedHorizontal + symbolsUnicode.lightDashedHorizontal + " ";


/**
* @description object that holds constants used to define the geometry of the
* visualization components.
* @global
* @type {object}
* @property {number} maxWidth - maximum width of the timeflow and all other panes. The width is the larger of 767 pixels or window.innerWidth or document.documentElement.clientWidth or
          document.body.clientWidth
* @property {number} uiMastheadHeight - height of the application masthead. Constant 90 pixels.
* @property {number} infoFlowHeight - height of the infoflow pane. Constant 200 pixels.
* @property {object} margin - object that defines margins surrounding *flow panes.
* @property {number} margin.top - top margin for *flow panes. Constant 20 pixels.
* @property {number} margin.right - right margin for *flow panes. Constant 20 pixels.
* @property {number} margin.bottom - bottom margin for *flow panes. Constant 20 pixels.
* @property {number} margin.left - left margin for *flow panes. Constant 20 pixels.
* @property {object} axis - object that defines the geometry for timeline axis.
* @property {number} axis.labelHeight - height of axis text labels. Constant 10 pixels.
* @property {number} axis.tickHeight - height of axis tick marks. Constant 6 pixels.
* @property {number} axis.lineStroke - stroke weight for axis lines. Constant 1 pixel.
* @property {object} axis.margin - object that defines axis margins.
* @property {number} axis.margin.top - top margin for axis. Constant 1 pixel.
* @property {number} axis.margin.bottom - bottom margin for axis. Constant 3 pixels.
* @property {object} statusBar - object that defines geometry for the status bar.
* @property {number} statusBar.lines - number of text lines reserved for the status bar. Constant 1 line.
* @property {number} statusBar.height - status bar text height. Constant 20 pixels.
* @property {object} statusBar.margin - status bar margins.
* @property {number} statusBar.margin.top - top margin for status bar. Constant 1 pixel.
* @property {number} statusBar.margin.bottom - bottom margin for status bar. Constant 2 pixels.
* @property {object} infoFlow - object that defines geometry for the info-flow pane.
* @property {number} infoFlow.maxTracks - sets the upper limit on the number of infoFlow tracks that can be viewed in the pane. Constant 1 track.
* @property {number} infoFlow.minTracks - sets the lower limit on the number of infoFlow tracks that can be viewed in the pane. Constant 1 track.
* @property {number} infoFlow.maxHeight - sets the upper limit on the number of pixels that define the infoFlow pane height. Constant 2880 pixels.
* @property {object} infoFlow.margin - object that defines info-flow pane margins.
* @property {number} infoFlow.margin.top - top margin for info-flow pane. Constant 0 pixels.
* @property {number} infoFlow.margin.bottom - bottom margin for info-flow pane. Constant 0 pixels.
* @property {object} infoFlow.track - object that defines info-flow track geometries.
* @property {number} infoFlow.track.maxHeight - set the upper limit on info-flow track heights. Constant 160 pixels.
* @property {number} infoFlow.track.height - set the info-flow track height. Constant 160 pixels.
* @property {number} infoFlow.track.space - set the spacing between info-flow tracks. Constant 2 pixels.
* @property {object} infoFlow.card - object that defines info-flow card geometries.
* @property {number} infoFlow.card.numberInPane - set the number of info-flow cards to view in the pane. Constant 4 cards. This value combined with pane width determin the width of each info-flow card.
* @property {number} infoFlow.card.width - variable that is defined at runtime by the values of other properties.
* @property {object} timeFlow - object that defines geometry for the timeFlow pane.
* @property {number} timeFlow.maxTracks - sets the upper limit on the number of timeFlow tracks that can be viewed in the pane. Constant 17 tracks.
* @property {number} timeFlow.minTracks - sets the lower limit on the number of timeFlow tracks that can be viewed in the pane. Constant 3 tracks.
* @property {number} timeFlow.maxHeight - sets the upper limit on the number of pixels that define the timeFlow pane height. Constant 292 pixels.
* @property {object} timeFlow.margin - object that defines timeFlow pane margins.
* @property {number} timeFlow.margin.top - top margin for timeFlow pane. Constant 3 pixels.
* @property {number} timeFlow.margin.bottom - bottom margin for timeFlow pane. Constant 3 pixels.
* @property {object} timeFlow.track - object that defines timeFlow track geometries.
* @property {number} timeFlow.track.maxHeight - set the upper limit on info-flow track heights. Constant 14 pixels.
* @property {number} timeFlow.track.height - set the info-flow track height. Constant 14 pixels.
* @property {number} timeFlow.track.space - set the spacing between info-flow tracks. Constant 3 pixels.
* @property {object} birdView - object that defines geometry for the birdView pane.
* @property {number} birdView.maxTracks - sets the upper limit on the number of birdView tracks that can be displayed in the pane. Constant 17 tracks.
* @property {number} birdView.minTracks - sets the lower limit on the number of birdView tracks that can be displayed in the pane. Constant 17 tracks.
* @property {number} birdView.maxHeight - sets the upper limit on the number of pixels that define the birdView pane height. Constant 17 pixels.
* @property {object} birdView.margin - object that defines birdView pane margins.
* @property {number} birdView.margin.top - top margin for birdView pane. Constant 3 pixels.
* @property {number} birdView.margin.bottom - bottom margin for birdView pane. Constant 3 pixels.
* @property {object} birdView.track - object that defines birdView track geometries.
* @property {number} birdView.track.maxHeight - set the upper limit on birdView track heights. Constant 1 pixels.
* @property {number} birdView.track.height - set the birdView track height. Constant 1 pixels.
* @property {number} birdView.track.space - set the spacing between birdView tracks. Constant 0 pixels.
*/
var timelineGeometry = {
  maxWidth: Math.max(window.innerWidth || document.documentElement.clientWidth ||
            document.body.clientWidth, 767) - 30,
  // The height of the timeflow pane is determined by the value of
  // - timeFlow.maxTracks this sets the maximum number of tracks that can be
  //                      viewed simultaneously on the timeflow pane.
  uiMastheadHeight: 90,
  infoFlowHeight: 200,
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
  statusBar: {lines: 1 , height: 20,
    margin: {top: 2, bottom: 2}},
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
  console.warn("WARNING: timeline geometry value out of range: Bird's eye view maxTracks should be less than or equal to timeFlow maxTracks!!!");
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
var hasSpatioFlow = null;
var hasInfoFlow = null;

function isString (obj) {
 return (Object.prototype.toString.call(obj) === '[object String]');
}



var processFileData = function (dataObject, aFile) {
  var tempSize = 0;
  var extMatch = null;
  var pattern = /[^\\\/]\.([^.\\\/]+)$/;
  //console.log(csvObject);
  timelineGeometry.maxWidth = Math.max(window.innerWidth || document.documentElement.clientWidth ||
            document.body.clientWidth, 767) - 30;
  if (aFile.type === 'text/csv' || aFile.type === 'text/x-csv' ||
    aFile.type === 'application/vnd.ms-excel' || aFile.type === 'text/plain') {
    fileData=d3.csv.parse(dataObject);
  } else if (aFile.type === 'text/json' || aFile.type === 'text/x-json' ||
    aFile.type === 'application/json') {
    fileData=JSON.parse(dataObject);
  } else {
    extMatch = (aFile.name.toLowerCase().match(pattern) || [null]).pop();
    if (extMatch === 'csv' || extMatch === null) {
    console.log("File ext: <", extMatch, '>');
    fileData=d3.csv.parse(dataObject);
    } else if (extMatch === 'json') {
      console.log("File ext: <json>");
      fileData=JSON.parse(dataObject);
    } else {
      console.warn("ERROR: unrecognized file type: " + (aFile.type || "<null>"));
      clearFileInput(document.getElementById("file-read"));
      return;
    }
  }

  tabSettings = new Settings('Settings', fileData);

  setElementState(null, 'tabSettings', 'enabled');
  setElementState(null, 'menuItemCloseFile', 'enabled');
/* Here might go algorithm to do statistical inference of data to locate
   temporal and spatial features. For now - rely on manual assignment only.

      fileData.forEach(function(fileRow) {
        fileRow.forEach(function(fileColumn){
          tempSize += fileColumn.length;
        })
        console.log(fileRow);
      })

      */
  return fileData;
};

function buildVisualization(fileData) {
  setElementState(null, 'tabVisualization', 'enabled');
  var targetNames = ['timeFlow'];
  if (fileData[0].loc === undefined) hasSpatioFlow = false;
  else hasSpatioFlow = true;

  if (infoCardLayout.row.length > 0) {
    hasInfoFlow = true;
    targetNames.push('infoFlow');
  } else hasInfoFlow = false;

  //console.log("File: " + aFile.name + " read complete!", fileData);
  timelineStatusBar(domStatusBar, fileList[0].name);
  if (hasSpatioFlow) spatioFlow(domSpatioFlow);

  timeline(domTimeline, domSpatioFlow, domInfoFlow)
      .data(fileData)
      .defineInfoflowPane( )
      .defineInfoflowArea( )
      .defineTimelinePane( )
      .defineTimeflowArea( )
      .band("timeFlow", false)
      .mainReference("timeFlow")
      .xAxis("timeFlow")
//      .tooltips("timeFlow")
      .defineBirdViewArea( )
      .band("birdView", true)
      .xAxis("birdView")
      .labels("timeFlow")
      .labels("birdView")
      .brush("birdView", targetNames)
      .band("infoFlow", false)
      .vScroll( )
//            .defineVerticalScrollArea( )
      .redraw();

      return fileData;
}

function openVisualization( ) {
  ConsoleLogHTML.DEFAULTS.log = "sansserifLog";
  ConsoleLogHTML.DEFAULTS.info = "sansserifLog";
  ConsoleLogHTML.DEFAULTS.warn = "sansserifWarn";
  ConsoleLogHTML.connect(document.getElementById("myULLogContainer")); // Redirect log messages
  return;
}

function closeVisualization(event, aFile) {
  //document.getElementsByClassName('tooltip').remove();
  d3.selectAll('.tooltip').remove();
  d3.selectAll('svg').remove();
  fileList=[];
  fileData=null;
  setElementState(event, 'tabVisualization', 'disabled');
  setElementState(event, 'tabSettings', 'disabled');
  setElementState(event, 'menuItemCloseFile', 'disabled');
  configData=[];
  console.log("Closing visualization");
  closeTab(event);
  closeSettings( );
  clearFileInput(document.getElementById("file-read"));
  ConsoleLogHTML.disconnect(); // Stop redirecting
}

function refreshVisualization( ) {
  //document.getElementsByClassName('tooltip').remove();
  d3.selectAll('.tooltip').remove();
  d3.selectAll('svg').remove();

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

/*
/ handleFileSelect
/ This function
/
/
*/
function handleFileSelect(evt) {
  //console.log(evt);
  if (evt.target.files.length > 0) {
    fileList=evt.target.files; // FileList object
  } else {
    // event cancelled
    return;
  }

  openVisualization();

  var output = [];

  for (var i = 0, f; f = fileList[i]; i++) {
    output.push('• Filename: ' + escape(f.name) + ', type: ' + (f.type || '<null>') + ', ' +
          f.size + ' bytes, last modified: ' +
          (f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a'
        ));
  }
//  var statusFilenameElement = document.getElementById('Filename');
//  statusFilenameElement.textContent = output.join('');
  var d = new Date();

  csblLogString = 'Opening file(s):\n' + output.join('\n');
  console.log(csblLogString);

  //document.getElementById('Log').innerHTML = '<span><strong>' + d.toUTCString() + ":</strong>" + ' Open file(s):<br><ul>' + output.join('') + '</ul></span>';
  setElementState(evt, 'tabLog', 'enabled');

  var reader = new FileReader();

//  reader.onload = function(event) {
//    fileData=d3.csv.parse(event.target.result);
//    console.log("fileData: ", fileData);
//    return;
//  }

  // Closure to capture the file information.
/*
  reader.onload = (function(theFile) {
    return function(e) {
//      var span = document.createElement('span');
//      var itemsCount = 0;
//      console.log("event: ", e);

      fileData=d3.csv.parse(e.target.result);
      console.log(fileData);
//      fileData.forEach(function(csvObject) {
//        console.log(JSON.stringify(csvObject));
//      });

//        fileData.forEach(function(csvObject){
//          itemsCount++;
//                  span.innerHTML += ['<text>', itemsCount + ": " + JSON.stringify(csvObject),'</text><br>'].join('');
//          span.innerHTML += '<text>' + itemsCount + ": " + JSON.stringify(csvObject) + '</text><br>';
//      });
//        document.getElementById('list').append(span, null);
    };
  })(f);
*/
//reader.onload = processFileData(evt.target.result, fileList[0]);
reader.onload = function(evt) {
  return processFileData(evt.target.result, fileList[0]);
};

  //reader.onloadend = function(event) {
  //  console.log(event, "File read complete!");
  //}

  // Read in the file as text.
  reader.readAsText(fileList[0]);

  return;
};
  // files is a FileList of File objects. List some properties.
  /*
  var output = [];
  for (var i = 0, f; f = files[i]; i++) {
    output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                f.size, ' bytes, last modified: ',
                f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                '</li>');

      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {
          var span = document.createElement('span');
          var itemsCount = 0;
          fileData=d3.csv.parse(e.target.result);
          fileData.forEach(function(csvObject){
            itemsCount++;
//                  span.innerHTML += ['<text>', itemsCount + ": " + JSON.stringify(csvObject),'</text><br>'].join('');
            span.innerHTML += '<text>' + itemsCount + ": " + JSON.stringify(csvObject) + '</text><br>';
          });
          document.getElementById('list').append(span, null);
        };
      })(f);

      // Read in the file as text.
      reader.readAsText(f);
    }
*/

function openTab(evt, tabName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
      tablinks[i].parentElement.className = tablinks[i].parentElement.className.replace("active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabName).style.display = "block";
//  console.log(evt.currentTarget.parentElement);
  evt.currentTarget.parentElement.className += "active";

//  if (tabName === 'Settings') {
//  }

}

function closeTab(evt) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
      tablinks[i].parentElement.className = tablinks[i].parentElement.className.replace("active", "");
  }
}

function setElementState(evt, elementName, elementState) {
  document.getElementById(elementName).disabled=((elementState === "disabled") ? true : false);
}

function getElementState(elementName) {
  var thisElement = document.getElementById(elementName);
  return thisElement.disabled;
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

function clearFileInput(ctrl) {
  try {
    ctrl.value = null;
  } catch(ex) { }
  if (ctrl.value) {
    ctrl.parentNode.replaceChild(ctrl.cloneNode(true), ctrl);
  }
}
