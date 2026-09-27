import Joi from "joi";

export const aboutValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().required().messages({
      "string.empty": "title kategori tidak boleh kosong.",
      "any.required": "title kategori wajib diisi.",
    }),
    description: Joi.string().required().messages({
      "string.empty": "description kategori tidak boleh kosong.",
      "any.required": "description kategori wajib diisi.",
    }),
    published: Joi.boolean().default(false),
  });

  return schema.validate(data, { abortEarly: false, allowUnknown: true });
};
