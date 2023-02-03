import { customAlphabet } from "nanoid";

const nanoid = customAlphabet(
  "A^}b,[H(Ra@9yxCLuO`k4?V5:qcK*_)TN7>l&.M~z#p=Ef+W2YFe'jU1{IJ6i$]0Qwtosr%B-nGdm!PX83h;ZvgD<S"
);

const lowerCaseLetters = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];
const upperCaseLetters = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const specialCharecters = [
  "!",
  "@",
  "#",
  "$",
  "%",
  "^",
  "&",
  "*",
  "(",
  ")",
  "_",
  "-",
  "+",
  "=",
  ";",
  "?",
  "<",
  ">",
  "%",
  "[",
  "]",
  "`",
  ":",
  ".",
  "~",
  "'",
  "{",
  "}",
];

const passwordInspectionLine = (password) => {
  let generatedPassword = password.split("");
  const lowerCaseRegx = /^(?=.*[a-z]).*$/;
  const upperCaseRegex = /^(?=.*[A-Z]).*$/;
  const digitRegex = /^(?=.*[0-9]).*$/;
  const specialCharectersRegex =
    /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/;

  if (!lowerCaseRegx.test(generatedPassword)) {
    const passwordIndex = Math.floor(
      Math.random() * (generatedPassword.length - 0 + 1) + 0
    );
    const character =
      lowerCaseLetters[
        Math.floor(Math.random() * (lowerCaseLetters.length - 0 + 1) + 0)
      ];
    generatedPassword[passwordIndex] = character;
  }
  if (!upperCaseRegex.test(generatedPassword)) {
    const passwordIndex = Math.floor(
      Math.random() * (generatedPassword.length - 0 + 1) + 0
    );
    const character =
      upperCaseLetters[
        Math.floor(Math.random() * (upperCaseLetters.length - 0 + 1) + 0)
      ];
    generatedPassword[passwordIndex] = character;
  }
  if (!digitRegex.test(generatedPassword)) {
    const passwordIndex = Math.floor(
      Math.random() * (generatedPassword.length - 0 + 1) + 0
    );
    const character =
      numbers[Math.floor(Math.random() * (numbers.length - 0 + 1) + 0)];

    generatedPassword[passwordIndex] = character;
  }
  if (!specialCharectersRegex.test(generatedPassword)) {
    const passwordIndex = Math.floor(
      Math.random() * (generatedPassword.length - 0 + 1) + 0
    );
    const character =
      specialCharecters[
        Math.floor(Math.random() * (specialCharecters.length - 0 + 1) + 0)
      ];
    generatedPassword[passwordIndex] = character;
  }
  return generatedPassword.join("");
};

export const generatePassword = () => {
  const randomLength = Math.floor(Math.random() * (14 - 9 + 1) + 9);
  const randomPassword = nanoid(randomLength);
  const passedInspectionPassword = passwordInspectionLine(randomPassword);
  return passedInspectionPassword;
};
