const fs = require("fs");

const elements = [
  "empty",
  "H",
  "He",
  "Li",
  "Be",
  "B",
  "C",
  "N",
  "O",
  "F",
  "Ne",
  "Na",
  "Mg",
  "Al",
  "Si",
  "P",
  "S",
  "Cl",
  "Ar",
  "K",
  "Ca",
  "Sc",
  "Ti",
  "V",
  "Cr",
  "Mn",
  "Fe",
  "Co",
  "Ni",
  "Cu",
  "Zn",
  "Ga",
  "Ge",
  "As",
  "Se",
  "Br",
  "Kr",
  "Rb",
  "Sr",
  "Y",
  "Zr",
  "Nb",
  "Mo",
  "Tc",
  "Ru",
  "Rh",
  "Pd",
  "Ag",
  "Cd",
  "In",
  "Sn",
  "Sb",
  "Te",
  "I",
  "Xe",
  "Cs",
  "Ba",
  "La",
  "Ce",
  "Pr",
  "Nd",
  "Pm",
  "Sm",
  "Eu",
  "Gd",
  "Tb",
  "Dy",
  "Ho",
  "Er",
  "Tm",
  "Yb",
  "Lu",
  "Hf",
  "Ta",
  "W",
  "Re",
  "Os",
  "Ir",
  "Pt",
  "Au",
  "Hg",
  "Tl",
  "Pb",
  "Bi",
  "Po",
  "At",
  "Rn",
  "Fr",
  "Ra",
  "Ac",
  "Th",
  "Pa",
  "U",
  "Np",
  "Pu",
  "Am",
  "Cm",
  "Bk",
  "Cf",
  "Es",
  "Fm",
  "Md",
  "No",
  "Lr",
  "Rf",
  "Db",
  "Sg",
  "Bh",
  "Hs",
  "Mt",
  "Ds",
  "Rg",
  "Cn",
  "Nh",
  "Fl",
  "Mc",
  "Lv",
  "Ts",
  "Og",
];

let engraven = [
  27, 12, 23, 16, 42, 26, 30, 1, 33, 35, 29, 20, 53, 11, 13, 15, 7, 25, 6, 17,
  82, 14, 34, 9, 38, 3,
];

let symbols = engraven.map((i) => elements[i]);

const sortAlphabetically = (arr) => {
  // Sort in-place
  arr.sort((a, b) => {
    if (a < b) {
      return -1;
    } else if (a > b) {
      return 1;
    } else {
      return 0;
    }
  });
};

sortAlphabetically(symbols);
console.log(symbols.join(" "));
// console.log(engravenNames.join(" "));

// Fetch word list
// (async () => {
//   let url = "https://github.com/dwyl/english-words/raw/master/words_alpha.txt";
//   let response = await fetch(url);
//   let text = await response.text();
//   // Download to file in nodejs
//   let filename = "words_alpha.txt";
//   fs.writeFileSync(filename, text);
// })();

// For every word in words_alpha.txt...
let words = fs
  .readFileSync("words_alpha.txt")
  .toString()
  .split("\n")
  .map((v) => v.trim());
// let words = ["life", "AlAl"];
let all = [];

function startsWithCaseInsensitive(string, prefix) {
  return string.slice(0, prefix.length).toLowerCase() === prefix.toLowerCase();
}

for (let word of words) {
  // Check if a combination of engravenNames can be used to spell the word
  let newPossibleCombinations = [];
  let possibleCombinations = [""]; // e.g. ["SIF", "SiF", SIf"]
  do {
    for (let combination of possibleCombinations) {
      for (let symbol of symbols) {
        if (startsWithCaseInsensitive(word, combination + symbol)) {
          // console.log("b ", symbol);
          newPossibleCombinations.push(combination + symbol);
        }
      }
      possibleCombinations = [...newPossibleCombinations];
      newPossibleCombinations = [];
    }
    // console.log("p1", possibleCombinations);

    // Check if combination equals word
    for (let combination of possibleCombinations) {
      // console.log(combination);
      if (combination.toLowerCase() === word.toLowerCase()) {
        all.push(combination);
      }
    }
  } while (possibleCombinations.length);
}

// Print all words to file
fs.writeFileSync("all.txt", all.join("\n"));
