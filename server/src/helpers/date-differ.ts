const dateDiffInMinutesBetweenTwoDate = (
  starts: string,
  ends: string
): number => {
  const dateDiff = Math.abs(
    new Date(starts).valueOf() - new Date(ends).valueOf()
  );
  const dateDiffInMinutes = Math.floor(dateDiff / 1000 / 60);

  return dateDiffInMinutes;
};

export { dateDiffInMinutesBetweenTwoDate };
