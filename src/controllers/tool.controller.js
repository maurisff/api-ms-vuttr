const repository = require('../repositories/tool.repository');

/**
 * New tool creation method
 * @param {Request} req
 * @param {Response} res
 */
exports.create = async (req, res) => {
  try {
    const {
      title, link, description, tags,
    } = req.body;

    const data = await repository.create({
      title, link, description, tags,
    });

    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Tool deletion method
 * @param {Request} req
 * @param {Response} res
 */
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await repository.delete(id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Tool search method
 * @param {Request} req
 * @param {Response} res
 */
exports.find = async (req, res) => {
  try {
    const { q, tag } = req.query;
    let data = [];
    if (q) {
      data = await repository.find({ $text: { $search: q } });
    } else if (tag) {
      data = await repository.find({ tags: { $all: [tag] } });
    } else {
      data = await repository.findAll();
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
