// NPM package
const Joi = require("joi");

// idea Schema validation
module.exports.ideaSchema = (payload) => {
  const schema = Joi.object({
    title: Joi.string().required().messages({
      "string.empty": "Title is required.",
      "any.required": "Title is a mandatory field.",
    }),
    idea: Joi.string().required().messages({
      "string.empty": "Idea description is required.",
      "any.required": "Idea description is a mandatory field.",
    }),
    region: Joi.string().valid(
      "North America", "Europe", "Asia", "Africa", "South America", "Australia"
    ).required().messages({
      "string.empty": "Region is required.",
      "any.required": "Region is a mandatory field.",
      "any.only": "Region must be one of the predefined options.",
    }),
    isCollaborative: Joi.boolean().default(false).messages({
      "boolean.base": "isCollaborative must be a boolean value.",
    }),
  }).unknown(false);

  const result = schema.validate(payload);
  return result;
};
