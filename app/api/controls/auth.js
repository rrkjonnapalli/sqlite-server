const { hasher, jwt } = require('@utils');
const { models, store } = require('@store');

const signup = async (req, res, next) => {
  try {
    const data = req.body;
    data.password = await hasher.hash(data.password);
    await store.create('User', { doc: data });
    res.status(201).send({});
  } catch (error) {
    return next(error);
  }
};

const signin = async (req, res, next) => {
  try {
    let { email, username, password } = req.body;
    let data = null;
    const query = email ? { email } : { username };
    data = await store.read('User', { where: query, findOne: true });
    if (!data) {
      const e = new Error('User not found with given username/email');
      e.status = 401;
      return next(e);
    }
    const status = await hasher.compare(password, data.password);
    if (!status) {
      const e = new Error('Invalid credentials');
      e.status = 401;
      return next(e);
    }
    ({ id, email, username } = data);
    const payload = { id, email, username };
    const token = jwt.encryptAndSign(payload);
    res.send({ token });
  } catch (error) {
    next(error);
  }
};

const signout = (req, res, next) => {
  try {
    /**
     * expire token
     */
    res.send({});
  } catch (error) {
    next(error);
  }
}

module.exports = {
  signup,
  signin,
  signout
};
