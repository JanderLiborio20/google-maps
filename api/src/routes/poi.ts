import { Poi } from '@prisma/client';
import express from 'express';
import poiController from '../controllers/poi-controller';

const router = express.Router();

router.post('/poi', async (req, res) => {
  const poi: Poi = req.body;

  try {
    const updated = await poiController.save(poi);

    return res.json({ updated });
  } catch (error) {
    console.log('poi post: ', error);
    res
      .status(500)
      .json({ message: 'Não foi possivel salvar o ponto de interesse.' });
  }
});

router.put('/poi', async (req, res) => {
  const poi: Poi = req.body;

  try {
    const updated = await poiController.save(poi);

    return res.json({ updated });
  } catch (error) {
    console.log('poi put: ', error);
    res
      .status(500)
      .json({ message: 'Não foi possivel salvar o ponto de interesse.' });
  }
});

router.get('/poi', async (req, res) => {
  try {
    const pois = await poiController.fetch();

    return res.json({ pois });
  } catch (error) {
    console.log('poi post: ', error);

    res
      .status(500)
      .json({ message: 'Não foi possivel salvar o ponto de interesse.' });
  }
});

export default router;
