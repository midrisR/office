import Joi from "joi";
export function productValidation(data) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(225).required().messages({
      "string.base": "should be a type of text",
      "string.empty": "name cannot be an empty field",
      "string.min": "name is required of {#limit}",
      "string.max":
        "name length must be less than or equal to {#limit} characters long",
      "any.required": "name is a required field",
    }),
    categorieId: Joi.string().required().messages({
      "strings.base": "should be a type of text",
      "string.empty": "categorie cannot be an empty field",
      "any.required": "categorie is a required field",
    }),
    brandId: Joi.string().required().messages({
      "string.base": "should be a type of text",
      "string.empty": "brand cannot be an empty field",
      "any.required": "brand is a required field",
    }),
    description: Joi.string().required().messages({
      "string.base": "should be a type of text",
      "string.empty": "description cannot be an empty field",
      "any.required": "description is a required field",
    }),
    metaDescription: Joi.string().required().messages({
      "string.base": "should be a type of text",
      "string.empty": "description cannot be an empty field",
      "any.required": "description is a required field",
    }),
    metaKeywords: Joi.string().required().messages({
      "string.base": "should be a type of text",
      "string.empty": "keywords cannot be an empty field",
      "any.required": "keywords is a required field",
    }),

    tag: Joi.string().required().messages({
      "string.base": "should be a type of text",
      "string.empty": "tag cannot be an empty field",
      "any.required": "active is a required field",
    }),
  });
  return schema.validate(data, { abortEarly: false });
}
