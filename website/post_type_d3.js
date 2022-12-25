const dummyData = [
  {
    post_type: "Question",
    count: 10,
  },
  {
    post_type: "Answer",
    count: 20,
  },
  {
    post_type: "Comment",
    count: 30,
  },
  {
    post_type: "Reply",
    count: 40,
  },
];

// d3.js v7 for a pie chart

const svg = d3.select("#post-type-chart");
// Make background light grey
svg.style("background-color", "#f0f0f0");
let margins = { top: 20, right: 20, bottom: 20, left: 20 };
let width = svg.attr("width") - margins.left - margins.right;
let height = svg.attr("height") - margins.top - margins.bottom;
// const svg = canvas.append("svg").attr("width", 600).attr("height", 600);

const createPieChart = (data, svg) => {
  // Title of the chart
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", 35)
    .attr("text-anchor", "middle")
    .attr("font-size", "1.5em")
    .text("Post Type");

  // Create a pie chart with a center of (width/2, height/2) and a radius of min(width/2-20, height/2-20)
  const pie = d3
    .pie()
    .value((d) => d.count)
    .sort(null);
  const arc = d3
    .arc()
    .innerRadius(0)
    .outerRadius(Math.min(width / 2 - 20, height / 2 - 20));

  // Create a color scale
  const colors = d3.scaleOrdinal().range(d3.schemeSet1);

  // Draw the pie chart
  svg
    .selectAll("path")
    .data(pie(data))
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("transform", `translate(${width / 2}, ${height / 2 + 35})`)
    .attr("fill", (d) => colors(d.data.post_type));

  // Draw the legend
  const legend = svg
    .selectAll(".legend")
    .data(colors.domain())
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", (d, i) => {
      return `translate(${width / 2 - 100}, ${height / 2 - 5 + i * 20})`;
    });

  // Draw the legend color rectangles
  legend
    .append("rect")
    .attr("x", width / 2)
    .attr("y", 0)
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", colors);

  // Draw the legend text
  legend
    .append("text")
    .attr("x", width / 2 + 20)
    .attr("y", 10)
    .attr("text-anchor", "start")
    .attr("font-size", "1em")
    .text((d) => d);
};

createPieChart(dummyData, svg);

console.log(canvas, "canvas");
