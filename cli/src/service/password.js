import { customAlphabet } from "nanoid";

const nanoid = customAlphabet(
  "A^}b,[H(Ra@9yxCLuO`k4?V5:qcK*_)TN7>l&.M~z#p=Ef+W2YFe'jU1{IJ6i$]0Qwtosr%B-nGdm!PX83h;ZvgD<S"
);

const lowerCaseLetters = ["abcdefghijklmnopqrstuvwxyz"];
const upperCaseLetters = ["ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
const numbers = ["1234567890"];
const specialCharecters = ["!@#$%^&*()_-+=;?<>"];

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
