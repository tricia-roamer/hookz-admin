const CryptoJS = require('crypto-js');

const db = require('../../../lib/pg/db');

const { success, badRequest } = require('../../../lib/grpc/responses');

const selectSubscription = require('../queries/selectSubscription');
const selectVaultReferences = require('../queries/selectVaultReferences');
const insertVaultItem = require('../queries/insertVaultItem');
const selectVaultItem = require('../queries/selectVaultItem');
const deleteVaultItem = require('../queries/deleteVaultItem');

module.exports = ({ pool, appSecret }) => {
  const { query } = db({ pool });

  const generate = ({ length }) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const decryptPassword = ({ password, secret }) => {
    const bytes = CryptoJS.AES.decrypt(password, secret);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  return {
    generatePassword: async (req, res) => {
      const { length } = req.inputs;

      const password = generate({ length });

      const response = {
        text: `Password suggestion: ${password} `,
        ...success('ok'),
      };

      res.status(200).send(response.text);

      // return response for tracking
      return response;
    },
    savePassword: async (req, res) => {
      const {
        subscriptionKey, reference, username, password,
      } = req.inputs;

      const [subscription] = await query(selectSubscription({ subscriptionKey }));

      // subscription does not exist
      if (!subscription) {
        const response = badRequest('invalid subscription key provided');

        res.status(response.response.status).send(response.response.message);

        // return response for tracking
        return response;
      }

      const encryptedPin = CryptoJS.AES.encrypt(password, appSecret).toString();

      await query(insertVaultItem({
        reference, username, password: encryptedPin, ...subscription,
      }));

      const response = success('vault item created');

      res.status(response.response.status).send(response.response.message);

      // return response for tracking
      return response;
    },

    getPassword: async (req, res) => {
      const {
        subscriptionKey, reference,
      } = req.inputs;

      const [subscription] = await query(selectSubscription({ subscriptionKey }));

      // subscription does not exist
      if (!subscription) {
        const response = badRequest('invalid subscription key provided');

        res.status(response.response.status).send(response.response.message);

        // return response for tracking
        return response;
      }

      const [item] = await query(selectVaultItem({ reference, ...subscription }));

      // vault item does not exist
      if (!item) {
        const response = badRequest('invalid subscription key + vault pairing');

        res.status(response.response.status).send(response.response.message);

        // return response for tracking
        return response;
      }

      const { password, username } = item;

      const decrypted = decryptPassword({ password, secret: appSecret });

      const response = {
        text: `Username: ${username} Password: ${decrypted}.`,
        ...success('ok'),
      };

      res.status(response.response.status).send(response.text);

      // return response for tracking
      return response;
    },

    deletePassword: async (req, res) => {
      const { subscriptionKey, reference } = req.inputs;

      const [subscription] = await query(selectSubscription({ subscriptionKey }));

      // subscription does not exist
      if (!subscription) {
        const response = badRequest('invalid subscription key provided');

        res.status(response.response.status).send(response.response.message);

        // return response for tracking
        return response;
      }

      const [item] = await query(deleteVaultItem({ reference, ...subscription }));

      // vault item does not exist
      if (!item) {
        const response = badRequest('invalid subscription key + vault pairing');

        res.status(response.response.status).send(response.response.message);

        // return response for tracking
        return response;
      }

      const response = success(`vault item ${reference} deleted`);

      res.status(response.response.status).send(response.response.message);

      // return response for tracking
      return response;
    },

    references: async (req, res) => {
      const { subscriptionKey } = req.inputs;

      const [subscription] = await query(selectSubscription({ subscriptionKey }));

      // subscription does not exist
      if (!subscription) {
        const response = badRequest('invalid subscription key provided');

        res.status(response.response.status).send(response.response.message);

        // return response for tracking
        return response;
      }

      const entries = await query(selectVaultReferences(subscription));

      const response = {
        text: entries
          ? `Your references are ${entries.map((obj) => obj.reference).join(', ')} `
          : 'You have no saved passwords ',
        ...success('ok'),
      };

      res.status(response.response.status).send(response.text);

      // return response for tracking
      return response;
    },
  };
};
