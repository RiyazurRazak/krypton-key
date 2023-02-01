import { SerialPort } from "serialport";
import { BAUD_RATE, PATH } from "../utils/constants.js";
import inquirer from "inquirer";
import figlet from "figlet";
import chalkAnimation from "chalk-animation";
import chalk from "chalk";
import standard from "./Standard.js";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
figlet.parseFont("Standard", standard);
chalkAnimation.rainbow(figlet.textSync("KRYPTON KEY", "Standard")).render();
console.log(chalk.yellow("A CLI tool to interact with your krypton key \n"));

const { port } = yargs(hideBin(process.argv)).argv;

console.log(
  chalk.magentaBright(
    port === undefined
      ? `Default PORT ${PATH} is set\n`
      : `PORT ${port} is set\n`
  )
);

const serialPort = new SerialPort({
  path: port === undefined ? PATH : port,
  baudRate: BAUD_RATE,
  autoOpen: true,
});

export { serialPort };
