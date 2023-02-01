import { generatePassword } from "../src/service/password";

describe("Generate Unique Password With Password Rules", () => {
  for (let i = 1; i <= 100; i++) {
    test(`${i} time`, () => {
      expect(generatePassword().length).toBeGreaterThan(7);
    });
  }
});
