import Joi from "joi";
export function employessVAlidation(data) {
  const schema = Joi.object().keys({
    name: Joi.string().required().messages({
      "string.base": " should be a type of text",
      "string.empty": "name cannot be an empty field",
      "string.min": "name min of {#limit} characters",
      "string.max":
        "name length must be less than or equal to {#limit} characters long",
      "any.required": "name is a required field",
    }),
    role_id: Joi.number().required().messages({
      "string.base": " should be a type of text",
      "string.empty": "role cannot be an empty field",
      "any.required": "role is a required field",
    }),
    phone: Joi.string()
      .pattern(new RegExp(/^(\+62|0)[0-9]{9,14}$/))
      .required()
      .messages({
        "string.base": " should be a type of number",
        "string.empty": "phone cannot be an empty field",
        "string.min": "phone min of {#limit} characters",
        "string.max":
          "phone length must be less than or equal to {#limit} characters long",
        "any.required": "phone is a required field",
        "string.pattern.base": "enter valid your phone number",
      }),
    email: Joi.string().required().messages({
      "string.base": " should be a type of text",
      "string.empty": "email cannot be an empty field",
      "string.min": "email min of {#limit} characters",
      "string.max":
        "email length must be less than or equal to {#limit} characters long",
      "any.required": "email is a required field",
    }),
  });
  return schema.validate(data, { abortEarly: false });
}
