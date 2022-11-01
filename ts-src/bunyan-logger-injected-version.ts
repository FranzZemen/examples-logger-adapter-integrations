/*
Created by Franz Zemen 11/01/2022
License Type: MIT
This is an exampple/good implementation of integrating @franzzemen/bunyan-logger-adapter with bunyan and the
@franzzemen/logger-adapter in an injected way.  This is the preferred method.
*/
import {bunyanBaseExecutionContext} from '@franzzemen/bunyan-logger-adapter';
import {LogExecutionContext, LoggerAdapter} from '@franzzemen/logger-adapter';
import {ModuleDefinition, ModuleResolution} from '@franzzemen/module-factory';
import {LoggerOptions} from 'bunyan';
import _ from 'lodash';

// Construct a bunyan logger options as usual, with any bunyan options you want.
const bunyanOptions: LoggerOptions = {name: 'example', level: 'info'};

// Create the injection, leveraging @franzzemen/module-factory, documented in that package
const bunyanAdapterDefinition: ModuleDefinition = {
  moduleName: '@franzzemen/bunyan-logger-adapter',
  moduleResolution: ModuleResolution.es, // We built the module as an ES module
  constructorName: 'BunyanLoggerAdapter',
  paramsArray: [bunyanOptions], // Parameters we'll pass to constructor
  // loadSchema:  // We trust the package, so we won't create a validation schema
}

// You can create your on LogExecutionContext object, per documentation in @franzzemen/logger-adapter or re-use
// a default bunyanBaseExecutionContext where bunyan specific optimal logging options are preset.  This is what
// we're doing here.  But first we copy it, so we can reuse it elsewhere.   Note that we use lodash merge here.  We've
// tested other open source merge function, but there are always issues with some cases like cyclical objects, so we
// lean on lodash merge, which handles cyclical objects reference copy.  (For clarity, there are no cyclical objects in
// bunyanBaseExecutionContext, not at least,  until we add the bunyan object as bunyan is cyclical.
const options: LogExecutionContext = _.merge<LogExecutionContext, LogExecutionContext>({}, bunyanBaseExecutionContext);

// Add the injection property.  The know the property path to "module" is not undefined in bunyanBaseExecutionContext
options.log.nativeLogger.module = bunyanAdapterDefinition

// Then in some @franzzemen function requiring it we could just pass that:  fictitiousFunction(someParam1, someParam2, options);
// Internally wherever logging is needed a new LoggerAdapter will be created as follows:

const log = new LoggerAdapter(options,
  'examples-logger-adapter-integrations',
  'Bunyan Tightly Coupled Example',
  'module set in options');



// And used as follows:
// Note:  Because @franzzemen/bunyan-logger-adapter is an ES module, you might wonder how we get by without any async code.
// It turns out that the logger adapter uses the ConsoleLogger until the promise to load the bunyan adapter is fulfilled.
// In fact the first log below is actually the ConsoleLogger, because the main thread has no opportunity to complete the promise
// So we provide an additional output to show the bunyan loader loaded.  The outputs are slight different, including, not
// shown here, the text colors.

log.info({context: 'injected', version: 'option', from: 'module'}, 'This is example output using options.log.nativeLogger.module');

/* Output showing it is not the bunyan logger, but the interim ConsoleLogger
 es module resolution, forcing asynchronous result
 {
  logLevelManagement: 'Native',
  module: {
    moduleName: '@franzzemen/bunyan-logger-adapter',
    moduleResolution: 'es',
    constructorName: 'BunyanLoggerAdapter',
    paramsArray: [ [Object] ],
    asyncFactory: false
  }
} Detected ES module as nativeLogger implementation, using native nativeLogger until it loads
 {
  message: 'This is example output using options.log.nativeLogger.module',
  attributes: {
    repo: 'examples-logger-adapter-integrations',
    source: 'Bunyan Tightly Coupled Example',
    method: 'module set in options',
    app: { appContext: 'Global' },
    execution: {
      thread: 'Thread: 32664215-bba6-4961-b3b0-98c163e704be',
      requestId: 'Request: 0e31ce70-42ec-4941-a619-eaf795dc7670',
      authorization: 'None',
      localContext: 'None'
    }
  },
  data: { context: 'injected', version: 'option', from: 'module' }
}
 ES module as nativeLogger implementation loaded dynamically
*/

setTimeout(()=>{
 log.info({context: 'injected', version: 'option', from: 'module'}, 'This is example output using options.log.nativeLogger.module');
},1);

/* Output
[2022-11-01T12:21:37.080Z]  INFO: example/21268 on Yorktown:
    message: This is example output using options.log.nativeLogger.module
    --
    attributes: {
      "repo": "examples-logger-adapter-integrations",
      "source": "Bunyan Tightly Coupled Example",
      "method": "module set in options",
      "app": {
        "appContext": "Global"
      },
      "execution": {
        "thread": "Thread: abf17fc3-27ba-4842-bbf2-265988ac1e77",
        "requestId": "Request: fe2b5cfd-e2ea-4cfb-9e60-6fb6a9f358e4",
        "authorization": "None",
        "localContext": "None"
      }
    }
    --
    data: {
      "context": "injected",
      "version": "option",
      "from": "module"
    }
*/
