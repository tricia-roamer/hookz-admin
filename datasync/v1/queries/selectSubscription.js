module.exports = ({ subscriptionKey }) => ({
  text: `
    SELECT
      id AS subscription_id
    FROM subscriptions
    WHERE subscription_key = $1 AND status = 'ACTIVE'
  `,
  values: [subscriptionKey],
});
