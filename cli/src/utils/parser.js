import chalk from "chalk";
import {
  DONE,
  ERROR,
  GENERATE_PASSWORD,
  INFO,
  PONG,
  RECIEVE_PASSWORD,
  SUCCESS,
} from "./constants.js";
import { generatePassword } from "../service/password.js";
import { Signal } from "./signal.js";

export class Parser extends Signal {
  #rawCommand;
  #commandType;
  #message;
  #processCommands = [PONG, GENERATE_PASSWORD, RECIEVE_PASSWORD];

  constructor() {
    super();
    this.#rawCommand = null;
    this.#commandType = null;
    this.#message = null;
  }

  parse(command) {
    this.#rawCommand = command;
    this.#parse();
  }

  #parse() {
    const [key, value] = this.#rawCommand.split(":");
    this.#commandType = key;
    this.#message = value;
    this.#isProcessTask() ? this.#process() : this.#log();
  }

  #isProcessTask() {
    return this.#processCommands.includes(this.#commandType);
  }

  #validateConnection() {
    if (this.#message === "INVALIDATE") {
      console.log(
        chalk.redBright("Failed To Authenticate \nInvalid Credentials ⚠️ \n")
      );
      process.exit();
    }
    console.log(
      chalk.greenBright(
        "Authenticated Successfully 🚀 \nSwitched To Admin Mode 🚀"
      )
    );
    this.defaultInputs();
  }

  #process() {
    switch (this.#commandType) {
      case PONG:
        this.#validateConnection();
        break;
      case GENERATE_PASSWORD:
        const password = generatePassword();
        this.sendPassword(`${this.#message}${password} `);
        break;
      case RECIEVE_PASSWORD:
        if (this.#message === "SUCCESS") {
          console.log(
            chalk.greenBright(
              "Password Generated & Encrypted Successfully For Current Enrolled Finger 🎊 \n"
            )
          );
          this.defaultInputs();
        } else {
          console.log(
            chalk.red(
              "Something gone wrong went try to generate password 😥 \nTry again..."
            )
          );
          process.exit();
        }
        break;
      default:
        break;
    }
  }

  #log() {
    switch (this.#commandType) {
      case ERROR:
        console.log(chalk.redBright(this.#message));
        process.exit();
        break;
      case INFO:
        console.log(chalk.yellowBright(this.#message));
        break;
      case SUCCESS:
        console.log(chalk.greenBright(this.#message));
        this.defaultInputs();
        break;
      case DONE:
        console.log(chalk.blueBright(this.#message));
        process.exit();
      default:
        break;
    }
  }
}
