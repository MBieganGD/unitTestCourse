const unitTestingTask = require("../unitTestingTask");
const polishLang = require("../lang/pl.js");
const TimezonedDate = require("timezoned-date");

describe("unitTestingTask Library Additional Tests", () => {
  it("should import the module correctly", () => {
    expect(unitTestingTask).toBeDefined();
  });

  it("should set the default language to English", () => {
    unitTestingTask.lang();
    expect(unitTestingTask.lang()).toBe("en");
  });
});

describe("unitTestingTask Library", () => {
  unitTestingTask.lang("en");

  describe("leadingZeroes", () => {
    it("should pad number with leading zeroes to the specified length", () => {
      expect(unitTestingTask.leadingZeroes(5, 3)).toBe("005");
      expect(unitTestingTask.leadingZeroes(123, 5)).toBe("00123");
      expect(unitTestingTask.leadingZeroes(123, 2)).toBe("123");
    });
  });

  describe("Date Formatting Tokens", () => {
    let testDate;

    beforeEach(() => {
      const UtcDate = TimezonedDate.makeConstructor(120);
      testDate = new UtcDate("2024-07-23T14:35:45.123Z");
    });

    const testCases = [
      ["YYYY", 2024],
      ["YY", "24"],
      ["MMMM", "July"],
      ["MMM", "Jul"],
      ["MM", "07"],
      ["M", 7],
      ["DDD", "Tuesday"],
      ["DD", "Tue"],
      ["D", "Tu"],
      ["dd", "23"],
      ["d", 23],
      ["HH", "16"],
      ["H", 16],
      ["hh", "04"],
      ["h", 4],
      ["mm", "35"],
      ["m", 35],
      ["ss", "45"],
      ["s", 45],
      ["ff", "123"],
      ["f", 123],
      ["A", "PM"],
      ["a", "pm"],
      ["ZZ", "+0200"],
      ["Z", "+02:00"],
    ];

    test.each(testCases)("%s token should return %s", (token, expected) => {
      expect(unitTestingTask.tokens[token](testDate)).toBe(expected);
    });
  });

  describe("unitTestingTask function", () => {
    let unitTestingTask;

    beforeEach(() => {
      jest.isolateModules(() => {
        unitTestingTask = require("../unitTestingTask");
      });
    });

    it("should throw an TypeError on missing or wrong type of format param", () => {
      expect(() => {
        unitTestingTask.unitTestingTask();
      }).toThrow(TypeError);

      expect(() => {
        unitTestingTask.unitTestingTask(123);
      }).toThrow("Argument `format` must be a string");
    });

    it("should throw an TypeError on missing or wrong type of date param", () => {
      expect(() => {
        unitTestingTask.unitTestingTask("format", null);
      }).toThrow(TypeError);

      expect(() => {
        unitTestingTask.unitTestingTask("format", { date: "2024" });
      }).toThrow(
        "Argument `date` must be instance of Date or Unix Timestamp or ISODate String"
      );
    });

    it("should format date according to provided format as param", () => {
      const testDate = new Date("2024-07-23T14:35:45.123");

      expect(
        unitTestingTask.unitTestingTask("YYYY-MMMM-DDD-HH-mm-ss", testDate)
      ).toBe("2024-July-Tuesday-14-35-45");

      expect(unitTestingTask.unitTestingTask("YY-M-D", testDate)).toBe(
        "24-7-Tu"
      );
    });
  });

  it("should use current date if no date is provided", () => {
    const currentDate = new Date();
    const formattedDate = unitTestingTask.unitTestingTask("YYYY-MM-dd");

    const expectedDate = `${currentDate.getFullYear()}-${unitTestingTask.leadingZeroes(
      currentDate.getMonth() + 1,
      2
    )}-${unitTestingTask.leadingZeroes(currentDate.getDate(), 2)}`;
    expect(formattedDate).toBe(expectedDate);
  });

  it("should use custom formatter if it exists", () => {
    const mockFormatter = jest.fn().mockReturnValue("formattedDate");
    unitTestingTask.unitTestingTask._formatters["customFormat"] = mockFormatter;

    const testDate = new Date("2024-07-23T14:35:45.123Z");
    const result = unitTestingTask.unitTestingTask("customFormat", testDate);

    expect(mockFormatter).toHaveBeenCalledWith(testDate);
    expect(result).toBe("formattedDate");
  });

  it("should fallback to default formatting if custom formatter does not exist", () => {
    const testDate = new Date("2024-07-23T14:35:45.123");
    const result = unitTestingTask.unitTestingTask("YYYY-MM-dd", testDate);

    expect(result).toBe("2024-07-23");
  });

  describe("unitTestingTask Language Module Loading", () => {
    let originalRequire;

    beforeAll(() => {
      originalRequire = require;
      unitTestingTask.lang("en");
    });

    afterAll(() => {
      require = originalRequire;
    });

    it("should return date in Polish Language", () => {
      unitTestingTask.lang("pl", polishLang);
      const testDate = new Date("2024-07-23T14:35:45.123");

      const formattedDate = unitTestingTask.unitTestingTask(
        "DDD, MMMM d, YYYY",
        testDate
      );

      expect(formattedDate).toBe("wtorek, lipiec 23, 2024");
    });

    it("should set the language if the module is successfully loaded", () => {
      require = jest.fn((module) => {
        if (module === "../lang/pl") {
          return { name: "Polish" };
        }
        return originalRequire(module);
      });

      expect(unitTestingTask.lang("pl")).toBe("pl");
    });

    it("should return the current language if the module fails to load", () => {
      require = jest.fn((module) => {
        if (module === "./test/fake") {
          throw new Error("Module not found");
        }
        return originalRequire(module);
      });

      const currentLang = unitTestingTask.lang();
      unitTestingTask.lang("test");

      expect(unitTestingTask.lang()).toBe(currentLang);
    });

    it("should return 'am' for token 'a' when the time is in the morning", () => {
      unitTestingTask.lang("en");
      const testDate = new Date("2024-07-23T10:00:00.000");

      expect(unitTestingTask.tokens.a(testDate)).toBe("am");
    });

    it("should return 'AM' for token 'A' when the time is in the morning", () => {
      unitTestingTask.lang("en");
      const testDate = new Date("2024-07-23T10:00:00.000");

      expect(unitTestingTask.tokens.A(testDate)).toBe("AM");
    });
  });

  describe("formatting function", () => {
    it("should create formatter", () => {
      const format = {
        en: "MMMM d, YYYY",
        default: "YYYY-MM-DD",
      };
      const testDate = new Date("2024-07-23T10:00:00.000");

      const formatter = unitTestingTask.createFormatter(format);

      expect(formatter(testDate)).toBe("July 23, 2024");
    });
  });

  describe("unitTestingTask.formatters", () => {
    it("should return the list of custom formats", () => {
      jest.isolateModules(() => {
        const unitTestingTask = require("../unitTestingTask");

        unitTestingTask.register("ISODate", () => {});
        unitTestingTask.register("ISOTime", () => {});
        unitTestingTask.register("ISODateTime", () => {});
        unitTestingTask.register("ISODateTimeTZ", () => {});
        unitTestingTask.register("customFormat", () => {});

        const expectedFormats = [
          "ISODate",
          "ISOTime",
          "ISODateTime",
          "ISODateTimeTZ",
          "customFormat",
        ];

        expect(unitTestingTask.formatters()).toEqual(expectedFormats);
      });
    });
  });
});
