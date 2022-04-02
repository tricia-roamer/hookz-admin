module.exports = ({
  reference, username, password, subscriptionId,
}) => ({
  text: `
    INSERT INTO vault
      (reference, username, password, subscription_id)
    VALUES
      ($1, $2, $3, $4)
    RETURNING id
  `,
  values: [reference, username, password, subscriptionId],
});
