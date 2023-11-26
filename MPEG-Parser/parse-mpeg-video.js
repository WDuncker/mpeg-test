import returnInputFileStream from "./return-input-file-stream.js";
import sortValidPIDs from "./sort-valid-pids.js";

//the main entry function
function parseMpegVideo(filePath) {
  var uniquePIDSet = new Set();

  // Create a readable stream from the TS file
  const stream = returnInputFileStream(filePath);

  // Define the sync byte for MPEG-TS (decimal 71)
  const SYNC_BYTE = 0x47;

  // Define the size of each TS packet (188 bytes)
  const PACKET_SIZE = 188;

  let accumulatedLength = 0;

  // Buffer to store partial packet data
  let partialPacket = Buffer.alloc(0);

  let packetCursor = 0;

  let isKeepGoing = true;

  // Event listener for data stream
  stream.on("data", (data) => {
    // Concatenate any remaining data from the previous chunk
    var fullData = Buffer.concat([partialPacket, data]);

    // Process complete packets
    while (fullData.length >= PACKET_SIZE && isKeepGoing) {
      const packet = Buffer.from(fullData.subarray(0, PACKET_SIZE));

      if (fullData.length < PACKET_SIZE) {
        Buffer.alloc(0);
        return;
      }

      // Check if the first byte is the sync byte
      if (packet[0] === SYNC_BYTE) {
        packetCursor++;
        accumulatedLength += PACKET_SIZE;

        // Extract PID from the PID field
        const pid = ((packet[1] & 0x1f) << 8) | packet[2];

        //Add to unique set
        uniquePIDSet.add(`0x${pid.toString(16).toLowerCase()}`);
      } else {
        isKeepGoing = false;
        uniquePIDSet.clear();

        try {
          const error = new Error(
            `No sync byte present in packet ${packetCursor}, offset ${accumulatedLength}`
          );

          throw error;
        } catch (error) {
          console.log(error.message);
          if (process.env.NODE_ENV !== "test") {
            process.exit(1);
          }
        }
      }

      // Remove the processed packet from the buffer
      fullData = Buffer.from(fullData.subarray(PACKET_SIZE));
    }

    // Save any remaining data for the next iteration
    partialPacket = fullData;
  });

  // Event listener for the end of the stream
  stream.on("end", () => {
    sortValidPIDs(uniquePIDSet);
    if (process.env.NODE_ENV !== "test") {
      process.exit(0);
    }
  });
}

//RUN!
if (process.env.JEST_WORKER_ID !== "1") {
  parseMpegVideo(process.argv[2]);
}

export default parseMpegVideo;
