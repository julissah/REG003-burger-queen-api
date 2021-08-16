module.exports.validateUser = (params) => {
  const checkForValidMongoDbID = new RegExp('^[0-9a-fA-F]{24}$');
  const validObjectId = checkForValidMongoDbID.test(params);

  if (validObjectId) {
    return { _id: params };
  }
  return { email: params };
};

module.exports.isAValidEmail = (email) => {
  const emailRegex = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/i;
  return (emailRegex.test(email));
};

module.exports.isAWeakPassword = (password) => ((password.length <= 3));

module.exports.isObjectId = (params) => {
  const checkForValidMongoDbID = new RegExp('^[0-9a-fA-F]{24}$');
  return checkForValidMongoDbID.test(params);
};