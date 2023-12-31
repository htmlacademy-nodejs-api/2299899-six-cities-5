import chalk from 'chalk';
import got from 'got';

import { getErrorMessage } from '../../shared/helpers/common.js';
import { TSVFileWriter } from '../../shared/libs/file-writer/tsv-file-writer.js';
import { TSVOfferGenerator } from '../../shared/libs/offer-generator/tsv-offer-generator.js';
import { MockServerData } from '../../shared/types/mock-server-data.type.js';
import { Command } from './command.interface.js';

export class GenerateCommand implements Command {
  private initialData: MockServerData;
  private readonly name = '--generate';

  private async load(url: string) {
    try {
      this.initialData = await got.get(url).json();
    } catch {
      throw new Error(`Can't load data from ${url}`);
    }
  }

  private async write(filepath: string, offersCount: number) {
    const tsvOfferGenerator = new TSVOfferGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < offersCount; i++) {
      await tsvFileWriter.write(tsvOfferGenerator.generate());
    }
  }

  public getName(): string {
    return this.name;
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    try {
      if (!count || count.length === 0) {
        throw new Error('No <n> argument');
      }
      if (!filepath || filepath.length === 0) {
        throw new Error('No <path> argument');
      }
      if (!url || url.length === 0) {
        throw new Error('No <url> argument');
      }

      const offersCount = Number.parseInt(count, 10);

      await this.load(url);
      await this.write(filepath, offersCount);
      console.info(chalk.green(`File ${filepath} was created!`));
    } catch (error) {
      console.error(chalk.red('Can\'t generate data'));
      console.error(chalk.red(`Details: ${getErrorMessage(error)}`));
    }
  }
}
