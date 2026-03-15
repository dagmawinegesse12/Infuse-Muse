import { defineCliConfig } from 'sanity/cli';
import { config as loadEnv } from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

loadEnv({ path: path.join(dirname, '.env') });
loadEnv({ path: path.join(dirname, '.env.local'), override: true });

const projectId = process.env.SANITY_STUDIO_PROJECT_ID?.trim();
const dataset = process.env.SANITY_STUDIO_DATASET?.trim() || 'production';

if (!projectId || !/^[a-z0-9-]+$/.test(projectId)) {
  throw new Error(`Invalid SANITY_STUDIO_PROJECT_ID: ${projectId ?? 'undefined'}. Check apps/studio/.env`);
}

export default defineCliConfig({
  api: {
    projectId,
    dataset
  }
});
