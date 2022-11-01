/*
Created by Franz Zemen 10/31/2022
License Type: MIT
*/
import {BunyanLoggerAdapter, bunyanBaseExecutionContext} from '@franzzemen/bunyan-logger-adapter';
import {LoggerAdapter} from '@franzzemen/logger-adapter';
import {LoggerOptions} from 'bunyan';
import deepmerge from 'deepmerge';

// Construct a bunyan logger options as usual
const bunyanOptions: LoggerOptions = {name: 'example', level: 'info'};
// Good idea to copy bunyanOptions so it can be reused for each logger.
const options = deepmerge({}, bunyanOptions);

// Version 1 - passing an instance to LoggerAdapter.  This is a tightly coupled option.
const logger = new BunyanLoggerAdapter(bunyanOptions)
const log = new LoggerAdapter(bunyanBaseExecutionContext,
  'examples-logger-adapater-integrations',
  'index',
  'Bunyan Logger for LoggerAdapter example, Version 1',
  logger);

log.info({hello: 'hello', world: 'world', from: 'bunyan'}, 'This is example output');
