import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";

export const sanityEnabled = Boolean(projectId && dataset);

export const sanityClient = sanityEnabled
  ? createClient({ projectId, dataset, apiVersion, useCdn: false, token: process.env.SANITY_API_READ_TOKEN })
  : null;
