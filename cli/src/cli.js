#! /usr/bin/env node

import { createSpinner } from "nanospinner";
import { ReadlineParser } from "@serialport/parser-readline";
import { Parser } from "./utils/parser.js";
import { serialPort } from "./service/serial.js";
import { Signal } from "./utils/signal.js";

const commandParser = new Parser();
const signal = new Signal();

const serialParser = serialPort.pipe(new ReadlineParser({ delimiter: "\r\n" }));

const spinner = createSpinner("Waiting to connect").start({
  color: "blue",
});

serialPort.on("open", () => {
  setTimeout(() => {
    spinner.success({
      text: "Connect Successfully 🤖 \n",
    });
    signal.ping();
  }, 1000);
});

serialParser.on("data", (data) => {
  commandParser.parse(data);
});

serialPort.on("error", (err) => {
  setTimeout(() => {
    spinner.error({ text: err, color: "red" });
    process.exit();
  }, 1000);
});
