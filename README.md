# MFW Ionic Push v1.0.0

This AngularJS module provides a push notifications API as part of **Mobile FrameWork (MFW)** for **Ionic** applications.


## Features


This module offers an abstraction of ngCordova's [`$cordovaPushV5`](http://ngcordova.com/docs/plugins/pushNotificationsV5/) plugin.



## Installation

### Via Bower

Use repository URL and version tag until module is published in a Bower registry.

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

Now you can inject both `$mfwiPush` services to register for push notifications and callbacks with new incomming messages or errors.


> For further documentation, please read the generated `ngDocs` documentation inside `docs/` folder.


## Usage

### Configure

Enable or disable push registration and set proper [platform configuration](https://github.com/phonegap/phonegap-plugin-push/blob/master/docs/API.md#pushnotificationinitoptions).

```js
// Inject $mfwiPush in angular.module phase.
angular
  .module('wl.social-care')
  .config(configPush)
  .run(handlePushes);

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
* Update both package.json and bower.json versions
* Tag Git with same version numbers as NPM and Bower versions
* Check for valid `ngDocs` output inside `docs/` folder

> **Important**: Run `npm install` before anything. This will install NPM and Bower dependencies.

> **Important**: Run `npm run deliver` before committing anything. This will build documentation and distribution files.
> It's a shortcut for running both `docs` and `build` scritps.


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
