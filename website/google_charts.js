google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawPostTypeChart);
google.charts.setOnLoadCallback(drawPostLengthChart);

// Load ./output.json and draw a scatter chart
let programData = null;
fetch("./output.json")
  .then((response) => response.json())
  .then((json) => {
    programData = json;
    google.charts.setOnLoadCallback(drawProgramVotesChart);
  });

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
  var dataTable = new google.visualization.DataTable();

  // Add columns
  dataTable.addColumn("number", "Votes");
  dataTable.addColumn("number", "Discussion count");

  // Add tooltip column
  dataTable.addColumn({ type: "string", role: "tooltip", p: { html: true } });

  // Add rows
  dataTable.addRows(
    programData.slice(1).map((row) => {
      return [
        row[5],
        row[7],
        `<div style="padding:5px;white-space:nowrap"><b>${row[1]}</b><br>Votes: ${row[5]}<br>Discussion count: ${row[7]}</div>`,
      ];
    })
  );

  var options = {
    title: "Semi-log Plot Program Votes vs Discussion Posts",
    pointSize: 3,
    height: 400,
    width: 700,
    backgroundColor: "#E4E4E4",
    hAxis: {
      title: "Votes",
      logScale: true,
      viewWindow: {
        min: 40,
        max: programData[1][5] * 1.2,
      },
    },
    vAxis: {
      title: "Discussion posts",
      logScale: true,
      viewWindow: {
        min: programData.at(-1)[7] / 1.2,
        max: programData[1][7] * 1.2,
      },
    },
    legend: "none",
    tooltip: { isHtml: true },
  };

  var opts = {
    containerId: "program-votes-chart",
    dataTable: dataTable,
    chartType: "ScatterChart",
    options: options,
  };
  var chartwrapper = new google.visualization.ChartWrapper(opts);
  // chartwrapper.setView({ columns: [5, 7] });
  // Show tooltip for column 0
  // chartwrapper.setOption("tooltip", { trigger: "selection" });

  chartwrapper.draw();
}
