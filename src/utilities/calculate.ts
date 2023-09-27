export const calcExpectedDeliveryTimes = (times: (string | number)[]) => {
  if (times.length < 1) return 2;
  const total = times.reduce((acc, cur) => Number(acc) + Number(cur), 0);
  return Math.ceil(Number(total) / times.length);
};

export const calcArrivalDate = (times: string[]) => {
  const today = new Date().getTime();
  const period = calcExpectedDeliveryTimes(times);
  const deliveryTime = 1000 * 60 * 60 * 24 * period;
  return new Date(today + deliveryTime).toLocaleDateString();
};
