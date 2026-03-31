import * as yup from 'yup'

// Define the validation schema
export const loginSchema = yup
  .object({
    email: yup
      .string()
      .required('Email is required')
      .email('Please enter a valid email'),
    password: yup
      .string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters'),
  })
  .required()

// Define the form values type based on the schema
export type LoginFormValues = yup.InferType<typeof loginSchema>

// Define the validation schema
export const registerSchema = yup
  .object({
    email: yup
      .string()
      .required('Email is required')
      .email('Please enter a valid email'),
    username: yup.string().required('Username is required'),
    password: yup
      .string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(
        /[^A-Za-z0-9]/,
        'Password must contain at least one special character'
      ),
    confirmPassword: yup
      .string()
      .required('Please confirm your password')
      .oneOf([yup.ref('password')], 'Passwords must match'),
    phone: yup
      .string()
      .optional()
      .test({
        name: 'phoneFormat',
        message: 'Invalid phone number',
        test: function (value) {
          // Skip validation if the value is empty or undefined
          if (!value) return true

          // Test against the E.164 format pattern
          return /^\+[1-9]\d{6,14}$/.test(value)
        },
      }),
    utm_source: yup.string().optional(),
    utm_campaign: yup.string().optional(),
  })
  .required()

// Define the form values type based on the schema
export type RegisterFormValues = yup.InferType<typeof registerSchema>

export const forgotPasswordEmailSchema = yup
  .object({
    email: yup
      .string()
      .required('Email is required')
      .email('Please enter a valid email'),
  })
  .required()
export type forgotPasswordEmailFormValues = yup.InferType<
  typeof forgotPasswordEmailSchema
>

export const resetPasswordFormSchema = yup
  .object({
    password: yup
      .string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(
        /[^A-Za-z0-9]/,
        'Password must contain at least one special character'
      ),
    confirmPassword: yup
      .string()
      .required('Please confirm your password')
      .oneOf([yup.ref('password')], 'Passwords must match'),
  })
  .required()
export type resetPasswordFormValues = yup.InferType<
  typeof resetPasswordFormSchema
>

export const profileInfoFormSchema = yup
  .object({
    username: yup.string().required('Username is required'),
    fullName: yup.string().required('Fullname is required'),
  })
  .required()
export type ProfileInfoFormValues = yup.InferType<typeof profileInfoFormSchema>
// Define the validation schema
export const changeEmailSchema = yup
  .object({
    newEmail: yup
      .string()
      .required('Email is required')
      .email('Please enter a valid email'),
  })
  .required()

// Define the form values type based on the schema
export type ChangeEmailValues = yup.InferType<typeof changeEmailSchema>

export const changeEmailCodeSchema = yup
  .object({
    oldEmailCode: yup
      .string()
      .required('code is required')
      .email('Please enter a valid email'),
    newEmailCode: yup
      .string()
      .required('code is required')
      .email('Please enter a valid email'),
  })
  .required()

// Define the form values type based on the schema
export type ChangeEmailCodeValues = yup.InferType<typeof changeEmailCodeSchema>

export const changePasswordSchema = yup
  .object({
    oldPassword: yup
      .string()
      .min(6, 'Password must be at least 6 characters')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(
        /[^A-Za-z0-9]/,
        'Password must contain at least one special character'
      ),
    newPassword: yup
      .string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(
        /[^A-Za-z0-9]/,
        'Password must contain at least one special character'
      ),
    confirmPassword: yup
      .string()
      .required('Please confirm your password')
      .oneOf([yup.ref('newPassword')], 'Passwords must match'),
  })
  .required()

// Define the form values type based on the schema
export type ChangePasswordFormValues = yup.InferType<
  typeof changePasswordSchema
>
