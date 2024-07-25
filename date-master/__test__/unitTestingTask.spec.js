const unitTestingTask = require("../unitTestingTask");
const polishLang = require("../lang/pl.js");

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
    const testDate = new Date("2024-07-23T14:35:45.123");

    it("should return full year for YYYY", () => {
      expect(unitTestingTask.tokens.YYYY(testDate)).toBe(2024);
    });
    it("YY token should return the last two digits of the year", () => {
      expect(unitTestingTask.tokens.YY(testDate)).toBe("24");
    });

    it("MMMM token should return the full month name", () => {
      expect(unitTestingTask.tokens.MMMM(testDate)).toBe("July");
    });

    it("MMM token should return the abbreviated month name", () => {
      expect(unitTestingTask.tokens.MMM(testDate)).toBe("Jul");
    });

    it("MM token should return the month with leading zeroes", () => {
      expect(unitTestingTask.tokens.MM(testDate)).toBe("07");
    });

    it("M token should return the month without leading zeroes", () => {
      expect(unitTestingTask.tokens.M(testDate)).toBe(7);
    });

    it("DDD token should return the full day name", () => {
      expect(unitTestingTask.tokens.DDD(testDate)).toBe("Tuesday");
    });

    it("DD token should return the abbreviated day name", () => {
      expect(unitTestingTask.tokens.DD(testDate)).toBe("Tue");
    });

    it("D token should return the first two letters of the day name", () => {
      expect(unitTestingTask.tokens.D(testDate)).toBe("Tu");
    });

    it("dd token should return the day of the month with leading zeroes", () => {
      expect(unitTestingTask.tokens.dd(testDate)).toBe("23");
    });

    it("d token should return the day of the month without leading zeroes", () => {
      expect(unitTestingTask.tokens.d(testDate)).toBe(23);
    });

    it("HH token should return the hours with leading zeroes", () => {
      expect(unitTestingTask.tokens.HH(testDate)).toBe("14");
    });

    it("H token should return the hours without leading zeroes", () => {
      expect(unitTestingTask.tokens.H(testDate)).toBe(14);
    });

    it("hh token should return the 12-hour format hours with leading zeroes", () => {
      expect(unitTestingTask.tokens.hh(testDate)).toBe("02");
    });

    it("h token should return the 12-hour format hours without leading zeroes", () => {
      expect(unitTestingTask.tokens.h(testDate)).toBe(2);
    });

    it("mm token should return the minutes with leading zeroes", () => {
      expect(unitTestingTask.tokens.mm(testDate)).toBe("35");
    });

    it("m token should return the minutes without leading zeroes", () => {
      expect(unitTestingTask.tokens.m(testDate)).toBe(35);
    });

    it("ss token should return the seconds with leading zeroes", () => {
      expect(unitTestingTask.tokens.ss(testDate)).toBe("45");
    });

    it("s token should return the seconds without leading zeroes", () => {
      expect(unitTestingTask.tokens.s(testDate)).toBe(45);
    });

    it("ff token should return the milliseconds with leading zeroes", () => {
      expect(unitTestingTask.tokens.ff(testDate)).toBe("123");
    });

    it("f token should return the milliseconds without leading zeroes", () => {
      expect(unitTestingTask.tokens.f(testDate)).toBe(123);
    });

    it("A token should return the uppercase meridiem", () => {
      expect(unitTestingTask.tokens.A(testDate)).toBe("PM");
    });

    it("a token should return the lowercase meridiem", () => {
      expect(unitTestingTask.tokens.a(testDate)).toBe("pm");
    });

    it("ZZ token should return the timezone offset without separator", () => {
      expect(unitTestingTask.tokens.ZZ(testDate)).toBe("+0200");
    });

    it("Z token should return the timezone offset with colon separator", () => {
      expect(unitTestingTask.tokens.Z(testDate)).toBe("+02:00");
    });
  });

  describe("unitTestingTask function", () => {
    beforeEach(() => {
      unitTestingTask._formatters = {};
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
      currentDate.getMonth() + 1
    )}-${unitTestingTask.leadingZeroes(currentDate.getDate())}`;
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
      unitTestingTask._formatters = {
        ISODate: () => {},
        ISOTime: () => {},
        ISODateTime: () => {},
        ISODateTimeTZ: () => {},
        customFormat: () => {},
      };

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

  describe("unitTestingTask.noConflict", () => {
    it("should restore the previous unitTestingTask and return the current unitTestingTask", () => {
      const root = {};
      const prevDate = "previousDate";
      global.root = root;
      global.prevDate = prevDate;

      const unitTestingTask = {
        noConflict: function () {
          root.unitTestingTask = prevDate;
          return this;
        },
      };

      const result = unitTestingTask.noConflict();

      expect(root.unitTestingTask).toBe(prevDate);

      expect(result).toBe(unitTestingTask);
    });
  });

  describe("unitTestingTask.noConflict", () => {
    let originalUnitTestingTask;
    let unitTestingTask;
    let prevDate;

    beforeEach(() => {
      originalUnitTestingTask = global.unitTestingTask;
      prevDate = "previousValue";
      global.unitTestingTask = "currentValue";

      unitTestingTask = function () {};
      unitTestingTask.noConflict = function () {
        global.unitTestingTask = prevDate;
        return this;
      };
    });

    afterEach(() => {
      global.unitTestingTask = originalUnitTestingTask;
    });

    it("should restore the previous value of window.unitTestingTask", () => {
      unitTestingTask.noConflict();
      expect(global.unitTestingTask).toBe(prevDate);
    });

    it("should return the unitTestingTask function itself", () => {
      const result = unitTestingTask.noConflict();
      expect(result).toBe(unitTestingTask);
    });
  });
});
