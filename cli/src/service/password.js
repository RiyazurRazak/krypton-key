import { customAlphabet } from "nanoid";

const nanoid = customAlphabet(
  "A^}b,[H(Ra@9yxCLuO`k4?V5:qcK*_)TN7>l&.M~z#p=Ef+W2YFe'jU1{IJ6i$]0Qwtosr%B-nGdm!PX83h;ZvgD<S"
);

export const generatePassword = () => {
  const randomLength = Math.floor(Math.random() * (14 - 9 + 1) + 9);
  const randomPassword = nanoid(randomLength);
  return randomPassword;
};
