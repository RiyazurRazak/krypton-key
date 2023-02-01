import inquirer from "inquirer";
import { OPERATIONS } from "./constants.js";

export class Inquirer {
  constructor() {}

  async defaultQuestions() {
    const { operation } = await inquirer.prompt([
      {
        type: "list",
        name: "operation",
        message: "Select Any One Operation To Perform",
        choices: Object.values(OPERATIONS),
      },
    ]);
    return operation;
  }
}
