const { User } = require('../models');

module.exports = async (req, res) => {
  const { id } = req.user;
  const { userId } = req.params;
  if (Number(userId) !== Number(id)) {
    return res.status(401).json({ message: 'Acesso negado' });
  }
  const result = await User.findByPk(id);
  res.status(200).json(result);
};
