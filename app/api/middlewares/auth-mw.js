const { jwt } = require('@utils')
module.exports = async (req, res, next) => {
  const { authorization } = req.headers;
  try {
    const token = authorization ? authorization.split(' ').pop() : '';
    req.user = await jwt.verifyAndDecrypt(token);
  } catch (error) {
    error.status = 401;
    return next(error);
  }
  return next();
}
