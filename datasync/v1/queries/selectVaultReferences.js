module.exports = ({ subscriptionId }) => ({
  text: `
    SELECT
      reference
    FROM vault
    WHERE subscription_id = $1
  `,
  values: [subscriptionId],
});
