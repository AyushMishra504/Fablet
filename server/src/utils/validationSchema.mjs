const createUserValidationSchema = {
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
    notEmpty: true,
    isString: {
      errorMessage: "email must be a string!",
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

export default createUserValidationSchema;
