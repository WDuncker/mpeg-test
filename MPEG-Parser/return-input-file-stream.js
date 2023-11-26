import fs from "fs";
//sets up the input mpeg ts input file , checks file exists etc and returns the file stream if everything is ok
function returnInputFileInputStream(filePath) {
  if (!filePath) {
    console.error("Usage: node parse-mpeg-video.js <input_file_name>");
    process.exit(1); // Exit with an error code
  } else {
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error("File does not exist:", filePath);
        process.exit(1); // Exit with an error code
      }
    });

    // Create a readable stream from the TS file
    return fs.createReadStream(filePath);
  }
}

export default returnInputFileInputStream;
