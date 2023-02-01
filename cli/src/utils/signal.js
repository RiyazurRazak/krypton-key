import chalk from "chalk";
import { serialPort } from "../service/serial.js";
import { createSpinner } from "nanospinner";
import {
  ADD_FINGERPRINT,
  COUNT_FINGERPRINTS,
  DELETE_FINGERPRINT,
  OPERATIONS,
  PING,
  TRANSMIT_PASSWORD,
} from "./constants.js";
import { Inquirer } from "./inquirer.js";
import chalkAnimation from "chalk-animation";

export class Signal extends Inquirer {
  spinner = createSpinner();
  constructor() {
    super();
  }

  #handleError(errorMessage) {
    console.log(chalk.redBright(`🥶 ${errorMessage}`));
    process.exit();
  }

  #write(message) {
    serialPort.write(message, (err) => {
      if (err) {
        this.#handleError(err);
      }
    });
    chalkAnimation.karaoke("Processing...");
  }

  sendPassword(password) {
    this.#write(`${TRANSMIT_PASSWORD}:${password}`);
  }

  ping() {
    this.#write(`${PING}:${process.env?.KRYPTON_AUTH}`);
  }

  async defaultInputs() {
    const answer = await this.defaultQuestions();
    this.#processOperation(answer);
  }

  #processOperation(operation) {
    switch (operation) {
      case OPERATIONS.addFingerprint:
        this.#write(`${ADD_FINGERPRINT}:XX`);
        break;

      case OPERATIONS.totalPasswordsGenerated:
        this.#write(`${COUNT_FINGERPRINTS}:XX`);
        break;

      case OPERATIONS.deleteFingerprint:
        this.#write(`${DELETE_FINGERPRINT}:XX`);
        break;

      case OPERATIONS.exit:
        console.log(chalk.magentaBright("Bye Bye 👋"));
        process.exit();

      default:
        break;
    }
  }
}
