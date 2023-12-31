import chalk from 'chalk';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { Command } from './command.interface.js';

type PackageJSONConfig = {
  version: string;
};

const isPackageJSONConfig = (value: unknown): value is PackageJSONConfig =>
  typeof value === 'object' &&
  value !== null &&
  !Array.isArray(value) &&
  Object.hasOwn(value, 'version');

export class VersionCommand implements Command {
  private readonly name = '--version';

  constructor(private readonly filePath: string = './package.json') {}

  private async readVersion(): Promise<string> {
    const jsonContent = await readFile(resolve(this.filePath), 'utf-8');
    const importedContent: unknown = JSON.parse(jsonContent);

    if (!isPackageJSONConfig(importedContent)) {
      throw new Error('Failed to parse json content.');
    }

    return importedContent.version;
  }

  public getName(): string {
    return this.name;
  }

  public async execute(..._parameters: string[]): Promise<void> {
    try {
      const version = await this.readVersion();
      console.info(chalk.green(version));
    } catch (error: unknown) {
      console.error(`Failed to read version from ${this.filePath}`);

      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }
}
