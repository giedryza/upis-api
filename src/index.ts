import { app } from 'config/app';

app.get('/', (req, res) => {
  res.status(200).send({});
});

const port = process.env.PORT;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`server started on port ${port}`);
});
