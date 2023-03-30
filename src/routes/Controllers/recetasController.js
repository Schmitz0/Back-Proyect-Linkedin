const { Router } = require('express');
const { Receta } = require('../../db.js');
const { Insumo } = require('../../db.js');
const { Movimiento } = require('../../db.js');

const router = Router();

router.get('/', async (req, res) => {
  try {
    const recetas = await Receta.findAll({
      include: [
        {
          model: Insumo,
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(recetas);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener las recetas');
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const receta = await Receta.findByPk(id, {
      include: [
        {
          model: Insumo,
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(receta);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error al obtener la receta de id ${id}`);
  }
});

router.post('/', async (req, res) => {
  const { name, insumos } = req.body;
  try {
    const receta = await Receta.create({ name });
    for (const { id, cantidad, costo, costoPorBotella } of insumos) {
      const insumo = await Insumo.findByPk(id);
      let precio = insumos.precio;
      await receta.addInsumo(insumo, { through: { cantidad } });
      await receta.addInsumo(insumo, { through: { costo } });
      await receta.addInsumo(insumo, { through: { costoPorBotella } });
      await insumo.update({
        precio: cantidad * costoPorBotella,
      });
    }
    res.json(receta);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear la receta');
  }
});

module.exports = router;
