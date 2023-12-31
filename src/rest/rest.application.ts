import cors from 'cors';
import express, { Express } from 'express';
import { inject, injectable } from 'inversify';

import { getFullServerPath, getMongoURI } from '../shared/helpers/index.js';
import { Config, RestSchema } from '../shared/libs/config/index.js';
import { DatabaseClient } from '../shared/libs/database-client/index.js';
import { Logger } from '../shared/libs/logger/index.js';
import { Controller, ExceptionFilter } from '../shared/libs/rest/index.js';
import { ParseTokenMiddleware } from '../shared/libs/rest/middleware/parse-token.middleware.js';
import { Service } from '../shared/types/index.js';
import { STATIC_FILES_ROUTE, STATIC_UPLOAD_ROUTE } from './rest.const.js';

@injectable()
export class RestApplication {
  private server: Express = express();

  constructor(
    @inject(Service.Logger) private readonly logger: Logger,
    @inject(Service.Config) private readonly config: Config<RestSchema>,
    @inject(Service.DatabaseClient) private readonly databaseClient: DatabaseClient,
    @inject(Service.OfferController) private readonly offerController: Controller,
    @inject(Service.UserController) private readonly userController: Controller,
    @inject(Service.ExceptionFilter) private readonly defaultExceptionFilter: ExceptionFilter,
    @inject(Service.CommentController) private readonly commentController: Controller,
    @inject(Service.AuthExceptionFilter) private readonly authExceptionFilter: ExceptionFilter,
    @inject(Service.HttpExceptionFilter) private readonly httpExceptionFilter: ExceptionFilter,
    @inject(Service.ValidationExceptionFilter) private readonly validationExceptionFilter: ExceptionFilter,
  ) {}

  async #initDb() {
    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );
    return this.databaseClient.connect(mongoUri);
  }

  async #initServer() {
    const port = this.config.get('PORT');
    this.server.listen(port);
  }

  async #initControllers() {
    this.server.use('/offers', this.offerController.router);
    this.server.use('/users', this.userController.router);
    this.server.use('/comments', this.commentController.router);
  }

  async #initMiddleware() {
    const authenticateMiddleware = new ParseTokenMiddleware(this.config.get('JWT_SECRET'));
    this.server.use(express.json());
    this.server.use(STATIC_UPLOAD_ROUTE, express.static(this.config.get('UPLOAD_DIRECTORY')));
    this.server.use(STATIC_FILES_ROUTE, express.static(this.config.get('STATIC_DIRECTORY_PATH')));
    this.server.use(authenticateMiddleware.execute.bind(authenticateMiddleware));
    this.server.use(cors());
  }

  async #initExceptionFilters() {
    this.server.use(this.authExceptionFilter.catch.bind(this.authExceptionFilter));
    this.server.use(this.validationExceptionFilter.catch.bind(this.validationExceptionFilter));
    this.server.use(this.httpExceptionFilter.catch.bind(this.httpExceptionFilter));
    this.server.use(this.defaultExceptionFilter.catch.bind(this.defaultExceptionFilter));
  }

  public async init() {
    this.logger.info('Application initialization...');

    this.logger.info('Init database...');
    await this.#initDb();
    this.logger.info('Init database complete.');

    this.logger.info('Init app-level middleware...');
    await this.#initMiddleware();
    this.logger.info('App-level middleware initialization complete.');

    this.logger.info('Init controllers...');
    await this.#initControllers();
    this.logger.info('Controller initialization complete.');

    this.logger.info('Init exception filters...');
    await this.#initExceptionFilters();
    this.logger.info('Exception filters initialization compleate.');

    this.logger.info('Init server...');
    await this.#initServer();
    this.logger.info(`🚀 Server started ${getFullServerPath(this.config.get('HOST'), this.config.get('PORT'))}.`);
  }
}
