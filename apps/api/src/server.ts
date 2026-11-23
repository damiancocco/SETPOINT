import { app } from './app.js';
import 'dotenv/config';

const port = Number(process.env.PORT ?? 3001);

app.listen(port, () => {
  console.log(`SETPOINT API listening on port ${port}`);
});
