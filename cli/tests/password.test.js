import { generatePassword } from "../src/service/password";

describe("Generate Unique Password with String Password Ruleset", () => {
  const regex = /^(?=.*[a-zA-Z0-9~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹])/;
  for (let i = 1; i <= 100; i++) {
    const passwordA = generatePassword();
    const passwordB = generatePassword();
    test(`${i} A password = ${passwordA}`, () => {
      expect(regex.test(passwordA)).toBe(true);
    });
    test(`${i} B password = ${passwordB}`, () => {
      expect(regex.test(passwordB)).toBe(true);
    });
    test(`${i} time`, () => {
      expect(passwordA).not.toBe(passwordB);
    });
  }
});
