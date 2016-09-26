# MFW Ionic Push v1.0.1

This AngularJS module provides a push notifications API as part of **Mobile FrameWork (MFW)** for **Ionic** applications.


## Features


This module offers an abstraction of ngCordova's [`$cordovaPushV5`](http://ngcordova.com/docs/plugins/pushNotificationsV5/) plugin.



## Installation

### Plugins

This module requires the following Cordova plugins:

* [phonegap-plugin-push](https://github.com/phonegap/phonegap-plugin-push)


### Via Bower

Get module from Bower registry.

```shell
$ bower install --save mfw-push-notifications-ionic
```


### Other

Download source files and include them into your project sources.



### Dependency

Once dependency has been downloaded, configure your application module(s) to require:

* `mfw-ionic.notifications.push ` module: provider and service to register for push notifications.

```js
angular
  .module('your-module', [
      // Your other dependencies
      'mfw-ionic.notifications.push'
  ]);
```

Now you can inject `$mfwiPush` service to register for push notifications and callbacks with new incoming messages or errors.


> For further documentation, please read the generated `ngDocs` documentation inside `docs/` folder.


## Usage

### Configure

Enable or disable push registration and set proper [platform configuration](https://github.com/phonegap/phonegap-plugin-push/blob/master/docs/API.md#pushnotificationinitoptions).

```js
angular
  .module('your-module')
  .config(configPush);

configPush.$inject = ['$mfwiPushProvider'];
function configPush($mfwiPushProvider) {
  $mfwiPushProvider.config({
    enabled: true,
    android: {
      senderID: "XXXXXXX"
    },
    ios: {
      alert: "true",
      badge: "true",
      sound: "true"
    },
    windows: {}
  });
}
```

### Listen

Listen for push notifications and errors.

```js
angular
  .module('your-module')
  .run(handlePushes);

handlePushes.$inject = ['$log', '$mfwiPush'];
function handlePushes($log, $mfwiPush) {
  $mfwiPush.getToken().then(function (token) {
    $log.log('Received token', token);
  });

  // triggered every time notification received
  $mfwiPush.onNotificationReceived(function (event, data) {
    $log.log('PUSH received. Event:', event, 'Data:', data);
    // data.message,
    // data.title,
    // data.count,
    // data.sound,
    // data.image,
    // data.additionalData
  });

  // triggered every time error occurs
  $mfwiPush.onNotificationError(function (event, e) {
    // e.message
    $log.error('PUSH error. Event:', event, 'Error:', e);
  });
}
```



## Development

* Use Gitflow
* Update package.json version
* Tag Git with same version numbers as NPM
* Check for valid `ngDocs` output inside `docs/` folder

> **Important**: Run `npm install` before anything. This will install NPM and Bower dependencies.

> **Important**: Run `npm run deliver` before committing anything. This will build documentation and distribution files.
> It's a shortcut for running both `docs` and `build` scripts.


### NPM commands

* Bower: install Bower dependencies in `bower_components/` folder:

```shell
$ npm run bower
```

* Build: build distributable binaries in `dist/` folder:

```shell
$ npm run build
```

* Documentation: generate user documentation (using `ngDocs`):

```shell
$ npm run docs
```

* Linting: run *linter* (currently JSHint):

```shell
$ npm run lint
```

* Deliver: **run it before committing to Git**. It's a shortcut for `docs` and `build` scripts:

```shell
$ npm run deliver
```
