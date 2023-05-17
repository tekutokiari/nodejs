const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      password: hashedPassword,
    });

    await user.save();
    res.json({
      message: 'User registered successfully!',
    });
  } catch (error) {
    res.json({
      message: `Error occured, ${error}`,
    });
  }
};

const login = async (req, res, next) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    const user = await User.findOne({
      $or: [{ email: username }, { phone: username }, { username }],
    });
    const compare = bcrypt.compare(password, user.password);
    if (compare) {
      const token = jwt.sign(
        { name: user.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME }
      );
      const refreshtoken = jwt.sign(
        { name: user.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME }
      );
      res.status(200).json({
        message: 'Login successful',
        token,
        refreshtoken,
      });
    } else {
      res.json({
        message: 'Password does not match',
      });
    }
  } catch (error) {
    res.json({
      error: error,
    });
  }
};

const refresh = async (req, res, next) => {
  try {
    const refreshtoken = req.body.refreshtoken;

    const verification = jwt.verify(
      refreshtoken,
      process.env.REFRESH_TOKEN_SECRET
    );
    if (verification) {
      let token = jwt.sign(
        { username: verification.name },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME }
      );
      let refreshtoken = req.body.refreshtoken;
      res.status(200).json({
        message: 'Token refreshed',
        token,
        refreshtoken,
      });
    }
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
};
module.exports = {
  register,
  login,
  refresh,
};
