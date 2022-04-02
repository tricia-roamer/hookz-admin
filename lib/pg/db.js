const camelCase = require('camelcase');

const transformVal = (val) => {
  if (val === null) { return undefined; }
  if (val instanceof Date) { return val.toISOString(); }
  return val;
};

const transformResponse = (obj) => {
  const output = {};
  Object.entries(obj).forEach(([key, val]) => {
    output[camelCase(key)] = transformVal(val);
  });
  return output;
};

module.exports = ({ pool }) => ({
  query: async ({ name, text, values }) => {
    const dbRes = await pool.query({
      name,
      text,
      values,
    });
    return dbRes.rows.map(row => transformResponse(row));
  },
});
