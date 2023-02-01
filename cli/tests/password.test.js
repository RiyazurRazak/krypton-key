import { generatePassword } from "../src/service/password";

describe("Generate Unique Password", () => {
  for (let i = 1; i <= 100; i++) {
    test(`${i} time`, () => {
      expect(generatePassword()).not.toBe(generatePassword());
    });
  }
});
