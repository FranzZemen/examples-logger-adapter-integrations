/*
Created by Franz Zemen 10/31/2022
License Type: MIT

This is an exampple/good implementation of integrating @franzzemen/bunyan-logger-adapter with bunyan and the
@franzzemen/logger-adapter in a tightly coupled way.
*/

import {bunyanBaseExecutionContext, BunyanLoggerAdapter} from '@franzzemen/bunyan-logger-adapter';
import {LogExecutionContext, LoggerAdapter} from '@franzzemen/logger-adapter';
import {LoggerOptions} from 'bunyan';
import _ from 'lodash';


// Construct a bunyan logger options as usual, with any bunyan options you want.
const bunyanOptions: LoggerOptions = {name: 'example', level: 'info'};

// Create the implementation of the Logger for Bunyan
const logger = new BunyanLoggerAdapter(bunyanOptions);

// You can create your on LogExecutionContext object, per documentation in @franzzemen/logger-adapter or re-use
// a default bunyanBaseExecutionContext where bunyan specific optimal logging options are preset.  This is what
// we're doing here.  But first we copy it, so we can reuse it elsewhere.   Note that we use lodash merge here.  We've
// tested other open source merge function, but there are always issues with some cases like cyclical objects, so we
// lean on lodash merge, which handles cyclical objects reference copy.  (For clarity, there are no cyclical objects in
// bunyanBaseExecutionContext, not at least,  until we add the bunyan object as bunyan is cyclical.
const options: LogExecutionContext = _.merge<LogExecutionContext, LogExecutionContext>({}, bunyanBaseExecutionContext);

// We can set additional logging or non-logging execution context options.  Now because the LoggerAdapter, where it's
// used in @franzzemen code is instantiated all over the place, we'll just be passing the LogExecutionContext.  We can
// set the Logger instance in a property as follows:
options.log.nativeLogger.instance = logger;


// Then in some @franzzemen function requiring it we could just pass that:  fictitiousFunction(someParam1, someParam2, options);
// Internally wherever logging is needed a new LoggerAdapter will be created as follows:
const log = new LoggerAdapter(options,
  'examples-logger-adapter-integrations',
  'Bunyan Tightly Coupled Example',
  'Instance set in options');

// And used as follows:

log.info({context: 'tight', version: 'option', from: 'bunyan'}, 'This is example output using options.log.nativeLogger.instance = logger');

/* Output
[2022-11-01T12:00:41.273Z]  INFO: example/7816 on Yorktown:
  message: This is example output using options.log.nativeLogger.instance = logger
--
  attributes: {
  "repo": "examples-logger-adapter-integrations",
    "source": "Bunyan Tightly Coupled Example",
    "method": "Instance set in options",
    "app": {
    "appContext": "Global"
  },
  "execution": {
    "thread": "Thread: 5a1197ab-21ea-44fe-8b13-54b43bf7162c",
      "requestId": "Request: 438e6499-962a-41ac-9d46-a08636972c85",
      "authorization": "None",
      "localContext": "None"
  }
}
--
  data: {
  "context": "tight",
    "version": "option",
    "from": "bunyan"
}
*/


// Noting that we want to use the LoggerAdapter ourselves, we could bypass that entirely and just pass the logger by parameter.  This is not how
// you would pass it to @franzzemen code, so you might leverage this in testing code.

const log2 = new LoggerAdapter(options,
  'examples-logger-adapter-integrations',
  'Bunyan Tightly Coupled Example',
  'Instance set passed to LoggerAdapter', logger);

// And used as follows:

log2.info({context: 'tight', version: 'parameter', from: 'bunyan'}, 'This is example output, passing by parameter');


