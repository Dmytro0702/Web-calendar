import * as functions from 'firebase-functions';

import { createApp } from './index.js';

const app = createApp();

export const api = functions
  .region('europe-west2') // London
  .https.onRequest(app);
