import convict from 'convict';
import validator from 'convict-format-with-validator';

import { RestSchema } from './rest.schema.type.js';

convict.addFormats(validator);

export const configRestSchema = convict<RestSchema>({
  HOST: {
    doc: 'Host to start service',
    format: String,
    env: 'HOST',
    default: null,
  },
  PORT: {
    doc: 'Port for incoming connections',
    format: 'port',
    env: 'PORT',
    default: null,
  },
  SALT: {
    doc: 'Salt for password hash',
    format: String,
    env: 'SALT',
    default: null,
  },
  DB_HOST: {
    doc: 'IP address of the database server (MongoDB)',
    format: 'ipaddress',
    env: 'DB_HOST',
    default: null,
  },
  DB_USER: {
    doc: 'Username to connect to the database',
    format: String,
    env: 'DB_USER',
    default: null,
  },
  DB_PASSWORD: {
    doc: 'Password to connect to the database',
    format: String,
    env: 'DB_PASSWORD',
    default: null,
  },
  DB_PORT: {
    doc: 'Port to connect to the database (MongoDB)',
    format: 'port',
    env: 'DB_PORT',
    default: null,
  },
  DB_NAME: {
    doc: 'Database name (MongoDB)',
    format: String,
    env: 'DB_NAME',
    default: null,
  },
  DB_UI_PORT: {
    doc: 'Database UI port (MongoExpress)',
    format: String,
    env: 'DB_UI_PORT',
    default: null,
  },
  DB_UI_USER: {
    doc: 'Database UI user (MongoExpress)',
    format: String,
    env: 'DB_UI_USER',
    default: null,
  },
  DB_UI_PASSWORD: {
    doc: 'Database UI password (MongoExpress)',
    format: String,
    env: 'DB_UI_PASSWORD',
    default: null,
  },
  UPLOAD_DIRECTORY: {
    doc: 'Directory for uploaded files',
    format: String,
    env: 'UPLOAD_DIRECTORY',
    default: null,
  },
  STATIC_DIRECTORY_PATH: {
    doc: 'Path to directory with static resources',
    format: String,
    env: 'STATIC_DIRECTORY_PATH',
    default: null,
  },
  JWT_SECRET: {
    doc: 'Secret for sign JWT',
    format: String,
    env: 'JWT_SECRET',
    default: null,
  },
});
