/**
 * programming app which take a info from user and add it in data.json file
 */

import fs from "fs";
const addToDataFile = (newItem) => {
  if (fs.existsSync("./data.json")) {
    const data = fs.readFileSync("./data.json", "utf8");
    const dataJSON = JSON.parse(data);

    if (Array.isArray(dataJSON)) {
      dataJSON.push(newItem);
    }

    fs.writeFileSync("./data.json", JSON.stringify(dataJSON, null, 2), "utf8");
    console.log(`Added new item`);
    return;
  } else {
    fs.writeFile(
      "./data.json",
      JSON.stringify([newItem], null, 2),
      "utf8",
      (err) => {
        if (err) console.log(err);
        console.log(`Create new data.json and Add new item successfully`);
      }
    );
  }
};

/*
  -> 1 - create app take answers from terminal and add it in another file ;
 */

/*
  node app.js name-abdo age-18 job-fullstack 

    const data = process.argv;
    let importantInfo = process.argv.slice(2);
    let info = [];
    for (let i = 0; i < importantInfo.length; i++) {
      const data = importantInfo[i].split("-");
      info.push({
        title: data[0],
        value: data[1],
      });
    
    }
    console.log(info);
*/

/*
//import -> commander ;

import { Command } from "commander";

const program = new Command();
  // take name , price and count if found to add item in store ;
  program
    .command("add")
    .alias("a")
    .description("Add new Item in cart")
    .argument("<title>", "Item title")
    .argument("<price>", "Item Price")
    .option("-c,--count <count>", "Number of items", "1")
    .action((title, price, option) => {
      const { count } = option;
      const newItem = {
        title,
        price,
        count,
      };
      addToDataFile(newItem)
      
    });
  program.parse(process.argv);
*/

// import -> inquirer ;

import inquirer from "inquirer";

const questions = [
  {
    name: "title",
    message: "Enter the item title:",
    type: "input",
  },
  {
    name: "price",
    message: "Enter the item Price:",
    type: "input",
  },
  {
    name: "count",
    message: "Enter the item Count:",
    type: "input",
    default: 1,
  },
];

inquirer
  .prompt(questions)
  .then((answers) => {
    addToDataFile(answers);
  })
  .catch((err) => console.log(err));
