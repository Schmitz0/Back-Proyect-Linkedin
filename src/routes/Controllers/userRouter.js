const { Router } = require('express');
const bcrypt = require('bcrypt');
const { Usuario } = require('../../db.js');
const jwt = require('jsonwebtoken');
const userExtractor = require('../middleware/userExtractor.js');
const { generateToken } = require('./utils.js');

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Usuario.findOne({ where: { email: email } });
    if (user) {
      if (bcrypt.compareSync(password, user.hashPassword)) {
        res.send({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: 'invalid email or password' });
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;