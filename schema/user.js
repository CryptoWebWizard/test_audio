const Joi = require('joi')

exports.userCreate = (req, res, next) => {
  // console.log(req.body, "in side file");
    let validationSchema = Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        full_name :Joi.string().required(),

    });
    let { error } = validationSchema.validate(req.body, { abortEarly: false });

    if (error) {
      let errorMessage = {};
      for (const err of error.details) {
        // errorMessage += " [ "+ err.message.slice(err.message.lastIndexOf("\"") + 1) + " ] ";
        errorMessage[err.context.key] = err.message;
      }
  
      res.json({
        status: 400,
        message: "Please provide valid/all detail",
        error: errorMessage,
      });
    } else {
      next();
    }
};

exports.userLogin = (req, res, next) => {

    let validationSchema = Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        // token: Joi.string().required(),
    });
    // let val = {
    //     ...req.params,
    //     ...req.query,
    //   };
    let { error } = validationSchema.validate(req.body, { abortEarly: false });
  
    if (error) {
      let errorMessage = {};
      for (const err of error.details) {
        // errorMessage += " [ "+ err.message.slice(err.message.lastIndexOf("\"") + 1) + " ] ";
        errorMessage[err.context.key] = err.message;
      }
  
      res.json({
        status: 400,
        message: "Please provide valid/all detail",
        error: errorMessage,
      });
    } else {
      next();
    }
};