/**
 * Supabase Migration Guide
 * 
 * All migrations are now managed through Supabase.
 * This file is kept for reference.
 */

import { logger } from '../../../core/utils/logger';

// ============================================
// MIGRATION GUIDE
// ============================================

/*
# Generate TypeScript types from Supabase schema:

1. Install Supabase CLI:
   npm install -g supabase

2. Login to Supabase:
   supabase login

3. Link your project:
   supabase link --project-ref vireabjnzjubdqpwfyrq

4. Generate types:
   supabase gen types typescript --linked > src/data/storage/types.ts

# Common Commands:

- Create migration: supabase migration new [name]
- Apply migrations: supabase db push
- Reset database: supabase db reset (⚠️  deletes all data)
- Start local dev: supabase start
- Stop local dev: supabase stop

# Database Schema Changes:

When you update schema in Supabase Dashboard:
1. Run: supabase gen types typescript --linked > src/data/storage/types.ts
2. Update domain/models/index.ts if needed
3. Update repositories
4. Test: npm run type-check
*/

export const migrations = {
  v1: async () => {
    logger.info('Migration v1: Schema now managed by Supabase');
    logger.info('See migration guide comments above');
  },
};
