function sortValidPIDs(uniquePIDSet) {
  const uniquePIDArray = [...uniquePIDSet];

  uniquePIDArray.sort((a, b) => {
    // Convert hexadecimal strings to numbers for comparison
    const numA = parseInt(a, 16);
    const numB = parseInt(b, 16);

    return numA - numB;
  });

  uniquePIDArray.forEach((elem) => {
    console.log(elem);
  });
}

export default sortValidPIDs;
