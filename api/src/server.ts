import cors from 'cors';
import express from 'express';
import POIRouter from './routes/poi';

const app = express();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3001;

app.get('/', (_, res) => {
  res.send('OK');
});

app.use('/v1', POIRouter);

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
