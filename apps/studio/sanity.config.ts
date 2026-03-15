import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes';

const rawProjectId = process.env.SANITY_STUDIO_PROJECT_ID?.trim();
const dataset = process.env.SANITY_STUDIO_DATASET?.trim() || 'production';

// Use a safe placeholder if the project ID is not yet configured.
// The studio will load but won't connect to a real project until this is set.
const projectId =
  rawProjectId && /^[a-z0-9-]+$/.test(rawProjectId)
    ? rawProjectId
    : 'not-configured';

if (projectId === 'not-configured') {
  console.warn(
    '⚠️  Sanity Studio: SANITY_STUDIO_PROJECT_ID is not set or invalid.\n' +
    '   Set it in apps/studio/.env to connect to your Sanity project.\n' +
    '   Format: SANITY_STUDIO_PROJECT_ID=your-project-id (lowercase letters, numbers, hyphens only)'
  );
}

export default defineConfig({
  name: 'default',
  title: 'Infuse & Muse Studio',
  projectId,
  dataset,
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes }
});
