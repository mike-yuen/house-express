import { celebrate, Joi, Segments } from 'celebrate';

export const SignUpSchema = celebrate(
  {
    [Segments.BODY]: Joi.object({
      username: Joi.string().required().min(3).max(128).trim(),
      email: Joi.string().required().min(8).max(254).lowercase().trim(),
      password: Joi.string().required(),
      // passwordConfirmation: Joi.valid(Joi.ref('password')).required(),
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
