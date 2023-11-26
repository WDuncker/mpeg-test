import { jest } from "@jest/globals";
import sortValidPIDs from "../MPEG-Parser/sort-valid-pids";
import parseMpegVideo from "../MPEG-Parser/parse-mpeg-video";

process.env.JEST_WORKER_ID = "1";
const originalConsoleLog = console.log;
const consoleOutput = [];
beforeEach(() => {
  console.log = jest.fn((...args) => {
    originalConsoleLog(...args);
    consoleOutput.push(...args);
  });
});

afterEach(() => {
  jest.clearAllMocks();
  consoleOutput.length = 0;
});

test("Given Set of PIDs when sort function attempted then should log PIDs to console in ascending order", () => {
  const pidSet = new Set(["0x10", "0x5", "0x20", "0x15"]);
  const expectedArray = ["0x5", "0x10", "0x15", "0x20"];

  sortValidPIDs(pidSet);

  expect(consoleOutput).toEqual(expectedArray);
});

process.env.NODE_ENV = "test";
describe("Given a mpegts file when parsing function is attempted then should either log unique PIDs or log an error message", () => {
  test("it should log PIDs to the console in ascending order", async () => {
    const passFile = "D:/mpeg-test/MPEG-Parser/MPEG-Parser/test_success.ts";
    const expectedResult = [
      "0x0",
      "0x11",
      "0x20",
      "0x21",
      "0x22",
      "0x23",
      "0x24",
      "0x25",
      "0x1fff",
    ];

    await new Promise((resolve) => {
      console.log = jest.fn((...args) => {
        originalConsoleLog(...args);
        consoleOutput.push(...args);
      });

      parseMpegVideo(passFile);

      setTimeout(() => {
        resolve();
      }, 2000);
    });

    expect(consoleOutput).toEqual(expectedResult);
  });

  test("it should log an error advising that no sync byte is present", async () => {
    const failFile = "D:/mpeg-test/MPEG-Parser/MPEG-Parser/test_failure.ts";
    const expectedResult = [
      "No sync byte present in packet 20535, offset 3860580",
    ];

    await new Promise((resolve) => {
      console.log = jest.fn((...args) => {
        originalConsoleLog(...args);
        consoleOutput.push(...args);
      });

      parseMpegVideo(failFile);

      setTimeout(() => {
        resolve();
      }, 2000);
    });

    expect(consoleOutput).toEqual(expectedResult);
    process.env.NODE_ENV = "production";
  });
});
