export const createUserValidationSchema = {
  name: {
    isLength: {
      options: {
        min: 5,
        max: 32,
      },
      errorMessage:
        "Name must be at least 5 characters with a max of 32 characters",
    },
    notEmpty: {
      errorMessage: "Name cannot be empty",
    },
    isString: {
      errorMessage: "Name must be a string!",
    },
  },
  email: {
    isEmail: {
      errorMessage: "Invalid email address",
    },
    notEmpty: {
      errorMessage: "Email is required",
    },
  },
  password: {
    notEmpty: true,
    isString: {
      errorMessage: "password must be a string!",
    },
    isLength: {
      options: {
        min: 6,
      },
      errorMessage: "password must be at least 6 characters",
    },
  },
};

// utils/loginValidationSchema.mjs
export const loginUserValidationSchema = {
  email: {
    isEmail: {
      errorMessage: "Invalid email address",
    },
    notEmpty: {
      errorMessage: "Email is required",
    },
  },
  password: {
    isString: {
      errorMessage: "Password must be a string",
    },
    notEmpty: {
      errorMessage: "Password is required",
    },
  },
};
