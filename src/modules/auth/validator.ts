import { celebrate, Joi } from 'celebrate';

export const SignUpSchema = celebrate({
  body: Joi.object({
    username: Joi.string().required().messages({ 'any.required': 'username is required.' }),
    email: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string(),
  }),
});

export const SignInSchema = celebrate({
  body: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
});
