google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawPostTypeChart);
google.charts.setOnLoadCallback(drawPostLengthChart);
google.charts.setOnLoadCallback(drawProgramVotesChart);

function drawPostTypeChart() {
  var data = google.visualization.arrayToDataTable([
    ["Type", "Count"],
    ["Questions", 11],
    ["Answers", 2],
    ["Comments", 20],
    ["Replies", 25],
  ]);

  var options = {
    title: "Post Type Breakdown",
    height: 400,
    width: 700,
    backgroundColor: "#E4E4E4",
    is3D: true,
  };

  var chart = new google.visualization.PieChart(
    document.getElementById("post-type-chart")
  );

  chart.draw(data, options);
}

function drawPostLengthChart() {
  var data = google.visualization.arrayToDataTable([
    ["Length"],
    [0.1],
    [0.2],
    [0.3],
    [0.4],
    [0.5],
    [0.6],
    [0.6],
    [0.6],
    [0.623],
    [0.623],
    [34],
    [23],
  ]);

  options = {
    height: 400,
    width: 700,
    backgroundColor: "#E4E4E4",

    title: "Approximating Normal Distribution",
    legend: { position: "none" },
    colors: ["#4285F4"],

    chartArea: { width: 605 },
    hAxis: {
      ticks: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    },
    bar: { gap: 0 },

    histogram: {
      bucketSize: 10,
      maxNumBuckets: 400,
      minValue: 0,
      maxValue: 100,
    },
  };
  var chart = new google.visualization.Histogram(
    document.getElementById("post-length-chart")
  );
  chart.draw(data, options);
}

function drawProgramVotesChart() {
  var data = google.visualization.arrayToDataTable([
    ["Votes", "Discussion count"],
    [12230, 313],
    [10353, 242],
    [9323, 201],
    [8323, 171],
    [7323, 141],
    [6323, 111],
    [5323, 81],
    [4323, 51],
    [3323, 21],
    [2323, 1],
  ]);

  var options = {
    title: "Program Votes vs Discussion Count",
    height: 400,
    width: 700,
    backgroundColor: "#E4E4E4",
    hAxis: { title: "Votes" },
    vAxis: { title: "Discussion count" },
    legend: "none",
  };

  var chart = new google.visualization.ScatterChart(
    document.getElementById("program-votes-chart")
  );

  chart.draw(data, options);
}
