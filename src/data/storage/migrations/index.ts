import { logger } from '../../../core/utils/logger';

export const migrations = {
  v1: async () => {
    logger.info('Running migration v1');
    // TODO: Create initial tables
  },
};
