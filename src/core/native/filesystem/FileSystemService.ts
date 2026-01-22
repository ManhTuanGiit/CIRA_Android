import { logger } from '../../utils/logger';

export interface FileSystemServiceInterface {
  readFile(path: string): Promise<string>;
  writeFile(path: string, content: string): Promise<void>;
  deleteFile(path: string): Promise<void>;
  exists(path: string): Promise<boolean>;
}

class FileSystemService implements FileSystemServiceInterface {
  async readFile(path: string): Promise<string> {
    logger.info('FileSystem: Read file', path);
    // TODO: Implement with react-native-fs or similar
    return '';
  }

  async writeFile(path: string, _content: string): Promise<void> {
    logger.info('FileSystem: Write file', path);
    // TODO: Implement file write
  }

  async deleteFile(path: string): Promise<void> {
    logger.info('FileSystem: Delete file', path);
    // TODO: Implement file delete
  }

  async exists(path: string): Promise<boolean> {
    logger.info('FileSystem: Check exists', path);
    // TODO: Implement file exists check
    return false;
  }
}

export const fileSystemService = new FileSystemService();
