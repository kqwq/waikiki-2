import fs from "fs";

// Download ./src.json, store it as JSON
const src = JSON.parse(fs.readFileSync("./src.json"));

// Take src[0].header and store the following header indices: 0,2,3,4,6,8,9,10,11,12,13,14
const headers = src[0].header;
const indices = [0, 2, 3, 4, 6, 8, 9, 10, 11, 12, 13, 14];
const headerNames = indices.map((i) => headers[i]);

// Take src[0].rows and
const outputJson = [headerNames];
const rows = src[0].rows;
rows.forEach((row) => {
  const newRow = indices.map((i) => row[i]);
  outputJson.push(newRow);
});

// Write outputJson to ./output.json
fs.writeFileSync("./output.json", JSON.stringify(outputJson));
