import { describe, it, expect } from "vitest";
import { validateAnswers } from "../src/utils/validation.js";
import { QUESTION_MAP } from "../src/utils/constants.js";

describe("validateAnswers", () => {
  //
  // VALID PAYLOADS
  //
  describe("valid payloads", () => {
    it("accepts a fully valid payload", () => {
      const payload = { q1: 1, q2: 2, q3: 3 };
      expect(validateAnswers(payload).ok).toBe(true);
    });

    it("accepts different valid combinations", () => {
      const payload = { q1: 6, q2: 4, q3: 5 };
      expect(validateAnswers(payload).ok).toBe(true);
    });

    it("accepts minimum valid values", () => {
      const payload = { q1: 1, q2: 1, q3: 1 };
      expect(validateAnswers(payload).ok).toBe(true);
    });

    it("accepts maximum valid values", () => {
      const payload = { q1: 6, q2: 4, q3: 6 };
      expect(validateAnswers(payload).ok).toBe(true);
    });
  });

  //
  // MISSING ANSWERS
  //
  describe("missing answers", () => {
    it("rejects missing q1", () => {
      const result = validateAnswers({ q2: 1, q3: 1 });
      expect(result.ok).toBe(false);
      expect(result.error).toContain("Missing answer");
      expect(result.error).toContain(QUESTION_MAP.q1);
    });

    it("rejects missing q2", () => {
      const result = validateAnswers({ q1: 1, q3: 1 });
      expect(result.ok).toBe(false);
      expect(result.error).toContain("Missing answer");
      expect(result.error).toContain(QUESTION_MAP.q2);
    });

    it("rejects missing q3", () => {
      const result = validateAnswers({ q1: 1, q2: 1 });
      expect(result.ok).toBe(false);
      expect(result.error).toContain("Missing answer");
      expect(result.error).toContain(QUESTION_MAP.q3);
    });

    it("rejects empty payload", () => {
      const result = validateAnswers({});
      expect(result.ok).toBe(false);
      expect(result.error).toContain("Missing answer");
    });
  });

  //
  // INVALID TYPES
  //
  describe("invalid answer types", () => {
    it("rejects string", () => {
      const result = validateAnswers({ q1: "1", q2: 1, q3: 1 });
      expect(result.ok).toBe(false);
      expect(result.error).toContain("must be an integer");
    });

    it("rejects float", () => {
      const result = validateAnswers({ q1: 1, q2: 1.5, q3: 1 });
      expect(result.ok).toBe(false);
      expect(result.error).toContain("must be an integer");
    });

    it("rejects null", () => {
      const result = validateAnswers({ q1: 1, q2: 1, q3: null });
      expect(result.ok).toBe(false);
      expect(result.error).toContain("must be an integer");
    });

    it("rejects boolean", () => {
      const result = validateAnswers({ q1: true, q2: 1, q3: 1 });
      expect(result.ok).toBe(false);
      expect(result.error).toContain("must be an integer");
    });

    it("rejects object", () => {
      const result = validateAnswers({ q1: { x: 1 }, q2: 1, q3: 1 });
      expect(result.ok).toBe(false);
      expect(result.error).toContain("must be an integer");
    });
  });

  //
  // INVALID VALUES
  //
  describe("invalid answer values", () => {
    it("rejects q1 = 0", () => {
      const result = validateAnswers({ q1: 0, q2: 1, q3: 1 });
      expect(result.ok).toBe(false);
      expect(result.error).toContain("Invalid answer");
      expect(result.error).toContain(QUESTION_MAP.q1);
    });

    it("rejects q1 = 7", () => {
      const result = validateAnswers({ q1: 7, q2: 1, q3: 1 });
      expect(result.ok).toBe(false);
      expect(result.error).toContain("Invalid answer");
    });

    it("rejects q2 = 5", () => {
      const result = validateAnswers({ q1: 1, q2: 5, q3: 1 });
      expect(result.ok).toBe(false);
      expect(result.error).toContain("Invalid answer");
    });

    it("rejects q3 = 7", () => {
      const result = validateAnswers({ q1: 1, q2: 1, q3: 7 });
      expect(result.ok).toBe(false);
      expect(result.error).toContain("Invalid answer");
    });

    it("rejects negative values", () => {
      const result = validateAnswers({ q1: -1, q2: 1, q3: 1 });
      expect(result.ok).toBe(false);
      expect(result.error).toContain("Invalid answer");
    });
  });

  //
  // EDGE CASES
  //
  describe("edge cases", () => {
    it("ignores extra properties", () => {
      const result = validateAnswers({
        q1: 1,
        q2: 1,
        q3: 1,
        extra: "ignored",
      });
      expect(result.ok).toBe(true);
    });

    it("treats explicitly undefined as missing", () => {
      const result = validateAnswers({ q1: 1, q2: undefined, q3: 1 });
      expect(result.ok).toBe(false);
      expect(result.error).toContain("Missing answer");
    });
  });
});
