const CustomError = require("../../helpers/error/CustomError");
const User = require("../../models/User");

const checkUserExists = (async (req, res, next) => {
  const id = req.params.id || req.query.id;
  const user = await User.findById({ _id: id });
  if (!user) {
    return next(new CustomError("There is no user with that id", 500));
  }
  next();
});

module.exports = {
  checkUserExists,
};