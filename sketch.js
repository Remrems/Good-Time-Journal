//Kommentar von Christian
var data = [];
var ready = false;
var dateScale = d3.scaleTime();
var timeScale = d3.scaleTime();
var hourScale = d3.scaleLinear(); //scaleLinear ist eine vordefinierte Funktion von d3, mapt in Zahlen
var dayScale = d3.scaleLinear();
//var parseDate = d3.timeParse('%m/%d/%y'); //2014-04-10 11:47:49
//Date sieht jetzt so aus in GTJ.csv: z.B. 09.10.18
var parseDate = d3.timeParse('%d.%m.%y'); // 09.10.18
var colorScale = d3.scaleOrdinal();
var activitesScale = d3.scalePoint();
var weekday = ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon'];
var dayHour  = ['12am', '1am','2am','3am','4am', '5am','6am','7am','8am','9am','10am','11am',
'12pm','1pm','2pm','3pm','4pm', '5pm','6pm','7pm','8pm','9pm','10pm','11pm'];
var activities = [];
var dataLength = 900;





function setup() {
  createCanvas(1200, 1700);


  noLoop();

  d3.csv("GTJ.csv", function (d, i) { //d geht jede einzelne Zeile durch. D= Array

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
      hour: +d.Hour,
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



  }).then(function (csv) {
    data = csv;
    ready = true;
    console.log(data);

    var dateDomain = d3.extent(data, function (d) {
      return d.date;
    });

    dateScale.domain(dateDomain)
      .range([0, 400]);

      let maxHour = d3.max(data, function (d) {
          return d.hour;
        });

      hourScale.domain([0, maxHour]) //domain nimmt die Ausgangswerte
      .range([0, 300]); //range gibt die Zielwerte auf die gemapt werden soll an


      dayScale.domain([0, dayHour.length])
      .range([0, 750]);


    let minStart = d3.min(data, function (d) {
      return d.start;
    });

    let maxEnd = d3.max(data, function (d) {
      return d.end;
    });

    timeScale.domain([minStart, maxEnd])
      .range([0, dataLength]);

    activities = d3.set(data, function (d) { //diese Funktion macht eine Liste der einzelnen Wochentage, und übernimmt jedes wort 1x
      return d.activities; //greift auf die vordefinierte variable weekday Z15 zu
    }).values();


    activitesScale.domain(activities).range([100, 900]);

    console.log("amount activities" + " " + activities.length);

    colorScale.domain(activities)
    .range(['#ff93ab',  '#94c3af', '#155a3c', '#ffb745', '#6a002b',
      '#138d90', '#001871', '#43bcff', '#ffb743', '#e95b4f', '#660033',
      '#a4e46b', '#fb6f62', '#f69454', '#24978d', '#01796f', '#990033',
      '#cb2636', '#a7dbce', '#6abf5a', '#ff8b27', '#d2ac7d', '#890029',
      '#79b120', '#ca326b', '#f3b0d0', '#A37AA5', '#e15a53','#bc7568',
      '#4c8cb5', '#de937c', '#374873', '#86b872', '#a76767', '#67709c',
      '#85b881', '#b2769d', '#8f6aa1', '#8ee5ee', '#009688', '#ff7878']);



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
    var y = dateScale(d.date) + 100;

    var start = timeScale(d.start);
    var end = timeScale(d.end);
    var color = colorScale(d.activities);
    noStroke();
    fill(color);
    rect(start + 100, y, end - start, 12);


    // for (var j = 0; j < weekday.length; j++) {

      // var day = weekday[i];
      // var yy = hourScale(d.hour) + 100;
      //
      // fill('black');
      // textAlign(LEFT);
      // textSize(12);
      // text(day, 100, yy);

}
for (var j = 0; j < dayHour.length; j++) {
  var hours = dayHour[j];
  var x = j * 900/dayHour.length + 100;

    fill('black');
    textAlign(LEFT);
    textSize(11);
    text(hours, x, 70);

console.log(x);
}

  for (var i = 0; i < activities.length; i++) {
    var d = activities[i];
    var x = 100;
    var color = colorScale(d);
    var y = activitesScale(d) + 500;
    fill(color);
    noStroke();
    ellipse(100, y-4, 15, 15);

    console.log();

    fill('black');
    textAlign(LEFT);
    textSize(12);
    text(d, 120, y);

  }



}
