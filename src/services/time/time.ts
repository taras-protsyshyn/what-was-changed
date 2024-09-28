export const toDate = (d?: string | number) => {
  return d ? new Date(Number(d)) : new Date();
};

export const getTime = (t?: string | number) => {
  if (t) {
    return new Date(Number(t)).getTime();
  }

  return new Date().getTime();
};

export const diffInDays = ({ from, to }: { from?: string | number; to?: string | number }) => {
  return Math.floor((getTime(to) - getTime(from)) / (24 * 60 * 60 * 1000));
};

export const formatDate = (date: string | number) => {
  const d = toDate(date);

  return `${d.getFullYear()}/${
    d.getMonth() + 1
  }/${d.getDate()}-${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
};
