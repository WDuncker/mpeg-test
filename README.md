# MPEG-Parser

- The purpose of this parser is to read and process MPEG-TS files.
- It will check for a sync byte at the start of each packet, if it does not find a sync byte in any given packet it will return an error message stating which packet is missing the sync byte and how far through the stream this occurred.
- If a sync byte is present in all packets, it will extract the packet IDs and list all unique packet IDs in the console.

- The parser was written in Javasvript using a node.js environment

To run this script:

- clone the repository
- open an instance of command prompt and navigate to the root directory of the repository
- run npm i to install all dependencies
- navigate into the folder housing parse-mpeg-video.js (MPEG-Parser)
- run the command "node parse-mpeg-video.js (filePath for .ts file)"

- I have written tests using jest to test the function which sorts the unique packet IDs in ascending order and a function which tests that the main entry function works and returns the expected results.

To run the tests:

- navigate to the root directory of the repository
- run the command npm test
