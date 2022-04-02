module.exports = ({ subscriptionId, reference }) => ({
  text: `
    DELETE FROM vault
    WHERE subscription_id = $1
      AND reference = $2
    RETURNING id
  `,
  values: [subscriptionId, reference],
});
