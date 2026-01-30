/* */
export const getPriceWithoutIva = (price: number, iva: number) => {
  return Math.floor((price / (1 + iva / 100)) * 100) / 100;
};

/* */
export const getIvaValue = (price: number, iva: number) => {
  return Math.floor(price * (iva / 100) * 100) / 100;
};


/* */
export const getPriceWithIva = (price: number, iva: number) => {
  return Math.floor(price * (1 + iva / 100) * 100) / 100;
};




/* */
export const formatPercentage = (
  value: number = 0,
  decimalPlaces: number = 2
): string => {
  return `${value.toFixed(decimalPlaces)}%`;
};
