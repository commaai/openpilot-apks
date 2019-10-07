export const round = (number, places) => {
  return +(Math.round(number + "e+" + places)  + "e-" + places);
}

export const formatCommas = (num) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
