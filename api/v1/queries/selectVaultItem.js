module.exports = ({ subscriptionId, reference }) => ({
  text: `
    SELECT
      username,
      password
    FROM vault
    WHERE subscription_id = $1
      AND reference = $2
  `,
  values: [subscriptionId, reference],
});
