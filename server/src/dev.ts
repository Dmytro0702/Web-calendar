import { createApp } from './index.js';

const port = Number(process.env.PORT) || 4000;
const app = createApp();

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
