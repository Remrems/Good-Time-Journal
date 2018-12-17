var data = [];
var ready = false;
var dateScale = d3.scaleTime();
var timeScale = d3.scaleTime();
var parseDate = d3.timeParse('%m/%d/%y'); //2014-04-10 11:47:49
var colorScale = d3.scaleOrdinal();
var activitesScale = d3.scalePoint();
var activities = [];




// var c = ["#C460E0",
// "#F469A9",
// "#69F5E7",
// "#687DF2",
// "#69F591",
// "#F1Ea67",
// "#F1Ea23",
// "#C460E0",
// "#F469A3",
// "#35F5E7",
// "#247DF2",
// "#FF0000",
// "#800000",
// "#FFFF00",
// "#808000",
// "#00FF00",
// "#008000",
// "#00FFFF",
// "#008080",
// "#0000FF",
// "#000080",
// "#FF00FF",
// "#800080",
// '#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
// '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
// '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
// '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
// '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
// '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
// '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
// '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
// '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
// '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'
// ];


// var someText = [];
// var wordFreq = {};

function setup() {
  createCanvas(1200, 1700);


  noLoop();

  d3.csv("GTJ.csv", function(d,i) { //d geht jede einzelne Zeile durch. D= Array

    var startDate = new Date();//parseDate(d.Date);
    var startTime = d.Start.split(':');
    startDate.setHours(startTime[0]);
    startDate.setMinutes(startTime[1]);

    var endDate = new Date();//parseDate(d.Date);
    var endTime = d.End.split(':');
    endDate.setHours(endTime[0]);
    endDate.setMinutes(endTime[1]);

    return {
      date: parseDate(d.Date), //plus sagt es ist eine Zahl //wir speichern die daten in eine Variable
      start: startDate,
      end: endDate,
      activities: d.Activities.toLowerCase(),
      environments: d.Environments,
      energylevel: +d.Energylevel,
      moodlevel: +d.Moodlevel,
      alcohol: d.Alcohol,
      objects: d.Objects,
      people: d.People,
      names: d.Namesofusers,
      engagement: +d.Engagement
    };



  }).then(function(csv) {
    data = csv;
    ready = true;
    console.log(data);

    var dateDomain = d3.extent(data, function(d){
      return d.date;
    });

    dateScale.domain(dateDomain)
    .range([0, 300]);


    let minStart = d3.min(data,function(d){
      return d.start;
    });

    let maxEnd = d3.max(data,function(d){
      return d.end;
    });

    timeScale.domain([minStart, maxEnd])
    .range([0, 600]);

     activities = d3.set(data, function(d){ //diese Funktion macht eine Liste der einzelnen Wochentage, und übernimmt jedes wort 1x
      return d.activities; //greift auf die vordefinierte variable weekday Z15 zu
    }).values();


    activitesScale.domain(activities).range([100, 900]);

    console.log("amount activities" + " " + activities.length);

    colorScale.domain(activities)
    .range(['#ff93ab','#bc7568', '#94c3af', '#155a3c', '#ffb745', '#6a002b',
    '#138d90', '#001871', '#43bcff', '#ffb743', '#e95b4f', '#660033',
    '#a4e46b', '#fb6f62', '#f69454', '#24978d', '#01796f', '#990033',
    '#cb2636', '#a7dbce', '#6abf5a', '#ff8b27', '#d2ac7d', '#890029',
    '#79b120', '#ca326b', '#f3b0d0', '#830015', '#e15a53',
    '#4c8cb5', '#de937c', '#374873', '#86b872', '#a76767', '#67709c',
    '#85b881', '#b2769d', '#8f6aa1', '#8ee5ee', '#009688', '#ff7878']);

    // colorScale.domain(activities)
    // .range(['#ff93ab', '#bc7568', '#94c3af', '#155a3c', '#ffb745', '#6a002b',
    // '#138d90', '#001871', '#43bcff', '#ffb743', '#e95b4f', '#660033',
    // '#a4e46b', '#fb6f62', '#f69454', '#24978d', '#01796f', '#990033',
    // '#cb2636', '#a7dbce', '#6abf5a', '#ff8b27', '#d2ac7d', '#890029',
    // '#79b120', '#b1d962', '#ca326b', '#f3b0d0', '#830015', '#e15a53',
    // '#4c8cb5', '#de937c', '#374873', '#86b872', '#a76767', '#67709c'
    // '#85b881', '#b2769d', '#8f6aa1', '#8ee5ee', '#009688', '#ff7878']);
//   var farbe = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075',
//   '#808080', '#000000',
//   '#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
//   '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
//   '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
//   '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC']
// console.log("amount colors" + farbe.length);




  redraw();
});

}

function draw() {

  if (!ready) {
    background(255, 0, 0);
    return;
  } else {
    background(255);
  }
  for (var i = 0; i < data.length; i++) {
    var d = data[i];
    var x = 100;
    var y = dateScale(d.date) +100;
    var start = timeScale(d.start);
    var end = timeScale(d.end);
    var color = colorScale(d.activities);
    //console.log(start + ',' + end);
    fill(color);
    rect(start + 200, y, end-start, 6);
  }

  for (var i = 0; i < activities.length; i++) {
    var d = activities[i];
    var x = 100;
    var color = colorScale(d);
    var y = activitesScale(d);
    fill(color);
    ellipse (200, y + 400, 10, 10);

fill('black');
    textAlign(LEFT);
    textSize(12);
    text(d, 300, y + 400);

  }



}
