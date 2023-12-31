import { Container } from 'inversify';

import { Config, RestConfig, RestSchema } from '../shared/libs/config/index.js';
import { DatabaseClient, MongoDatabaseClient } from '../shared/libs/database-client/index.js';
import { Logger, PinoLogger } from '../shared/libs/logger/index.js';
import {
  DefaultExceptionFilter, ExceptionFilter, HttpErrorExceptionFilter
} from '../shared/libs/rest/index.js';
import {
  ValidationExceptionFilter
} from '../shared/libs/rest/middleware/validation.exception-filter.js';
import { PathTransformer } from '../shared/libs/rest/transform/path-transformer.js';
import { Service } from '../shared/types/index.js';
import { RestApplication } from './rest.application.js';

export function createRestApplicationContainer() {
  const restApplicationContainer = new Container();

  restApplicationContainer.bind<RestApplication>(Service.RestApplication).to(RestApplication).inSingletonScope();
  restApplicationContainer.bind<Logger>(Service.Logger).to(PinoLogger).inSingletonScope();
  restApplicationContainer.bind<Config<RestSchema>>(Service.Config).to(RestConfig).inSingletonScope();
  restApplicationContainer.bind<DatabaseClient>(Service.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();
  restApplicationContainer.bind<ExceptionFilter>(Service.ExceptionFilter).to(DefaultExceptionFilter).inSingletonScope();
  restApplicationContainer.bind<ExceptionFilter>(Service.HttpExceptionFilter).to(HttpErrorExceptionFilter).inSingletonScope();
  restApplicationContainer.bind<ExceptionFilter>(Service.ValidationExceptionFilter).to(ValidationExceptionFilter).inSingletonScope();
  restApplicationContainer.bind<PathTransformer>(Service.PathTransformer).to(PathTransformer).inSingletonScope();

  return restApplicationContainer;
}
