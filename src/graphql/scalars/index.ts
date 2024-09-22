import Date from './Date';

export default {
  Date,
  ISO8601DateTime: Date,
  ISO8601Date: Date,
} as {
  [key: string]: (str: string | null) => unknown;
};
