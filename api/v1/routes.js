const Joi = require('joi');

const express = require('express');
const { catchError } = require('./handlers/errorHandler');
const initTrackingHandler = require('./handlers/trackingHandler');

const initValidator = require('./middleware/validate');
const initApiController = require('./controllers/apiController');

const generatePasswordSchema = Joi.object().keys({
  length: Joi.string().required(),
});

const savePasswordSchema = Joi.object().keys({
  subscriptionKey: Joi.string().required(),
  reference: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const getPasswordSchema = Joi.object().keys({
  subscriptionKey: Joi.string().required(),
  reference: Joi.string().required(),
});

const deletePasswordSchema = Joi.object().keys({
  subscriptionKey: Joi.string().required(),
  reference: Joi.string().required(),
});

const referencesSchema = Joi.object().keys({
  subscriptionKey: Joi.string().required(),
});

// get_references

module.exports = ({ pool, appSecret }) => {
  const router = express.Router();
  const track = initTrackingHandler();

  const validateGeneratePassword = initValidator({ schema: generatePasswordSchema });
  const validateSavePassword = initValidator({ schema: savePasswordSchema });
  const validateGetPassword = initValidator({ schema: getPasswordSchema });
  const validateDeletePassword = initValidator({ schema: deletePasswordSchema });
  const validateReferences = initValidator({ schema: referencesSchema });

  const {
    generatePassword, savePassword, getPassword, deletePassword, references,
  } = initApiController({ pool, appSecret });

  router.get(
    '/generate-password',
    catchError(validateGeneratePassword),
    catchError(track(generatePassword, 'generate_password')),
  );

  router.get(
    '/save-password',
    catchError(validateSavePassword),
    catchError(track(savePassword, 'save_password')),
  );

  router.get(
    '/get-password',
    catchError(validateGetPassword),
    catchError(track(getPassword, 'get_password')),
  );

  router.get(
    '/delete-password',
    catchError(validateDeletePassword),
    catchError(track(deletePassword, 'delete_password')),
  );

  router.get(
    '/references',
    catchError(validateReferences),
    catchError(track(references, 'references')),
  );

  return router;
};
