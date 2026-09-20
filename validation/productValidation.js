import Joi from "joi";
const ALLOWED_IMAGE_FORMATS = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
];
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
    categorieId: Joi.number().integer().required().messages({
      "number.base": "Kategori harus berupa angka",
      "any.required": "Kategori wajib dipilih",
    }),
    brandId: Joi.number().integer().required().messages({
      "number.base": "Brand harus berupa angka",
      "any.required": "Brand wajib dipilih",
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
    published: Joi.boolean().optional(),
    tag: Joi.string().required().messages({
      "string.base": "should be a type of text",
      "string.empty": "tag cannot be an empty field",
      "any.required": "active is a required field",
    }),
    images: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
          size: Joi.number()
            .max(2 * 1024 * 1024)
            .messages({
              "number.max":
                "Ukuran gambar terlalu besar. Maksimal upload adalah 2MB.",
            }),

          // 2. Terapkan validasi format di sini
          type: Joi.string()
            .valid(...ALLOWED_IMAGE_FORMATS)
            .required()
            .messages({
              "any.only":
                "Format gambar ditolak! Hanya diperbolehkan format JPG, PNG, atau WEBP.",
              "any.required": "Tipe file tidak terdeteksi.",
            }),
        }),
      )
      .min(1)
      .messages({
        "array.min": "image is a required field",
      }),
  });
  return schema.validate(data, { abortEarly: false });
}
