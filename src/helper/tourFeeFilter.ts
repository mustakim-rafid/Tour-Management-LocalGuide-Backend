export function getTourFeeFilter(range: string) {
  switch (range) {
    case "lt500":
      return { tourFee: { lt: 500 } };
    case "500-1000":
      return { tourFee: { gte: 500, lte: 1000 } };
    case "1000-2000":
      return { tourFee: { gte: 1000, lte: 2000 } };
    case "2000-5000":
      return { tourFee: { gte: 3000, lte: 5000 } };
    case "gt5000":
      return { tourFee: { gt: 5000 } };
    default:
      return {};
  }
}
