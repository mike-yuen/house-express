import { celebrate, Joi, Segments } from 'celebrate';

export const SignUpSchema = celebrate(
  {
    [Segments.BODY]: Joi.object({
      username: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
      role: Joi.string(),
    }),
  },
  {
    abortEarly: false,
    messages: {
      'string.empty': '{#label} cant be empty!',
      'any.required': '{#label} is a required field for this operation',
    },
  },
);

export const SignInSchema = celebrate(
  {
    [Segments.BODY]: Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    }),
  },
  { abortEarly: false },
);
