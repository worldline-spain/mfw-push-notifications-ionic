(function () {
  'use strict';

  /**
   * @ngdoc overview
   * @module mfwi.notifications.push
   * @name mfwi.notifications.push
   *
   * @requires ionic
   * @requires ngCordova
   *
   * @description
   * # Description
   *
   * This module provides an abstraction of ngCordova's {@link http://ngcordova.com/docs/plugins/pushNotificationsV5/ `$cordovaPushV5` plugin}.
   */
  var PushModule = angular.module('mfw-ionic.notifications.push', [
    'ionic',
    'ngCordova'
  ]);


  /**
   * RUN section
   */
  PushModule.run(configPush);
  configPush.$inject = ['$mfwiPush'];
  function configPush($mfwiPush) {
    $mfwiPush.init();
  }


  /**
   * @ngdoc service
   * @name mfwi.notifications.push.$mfwiPushProvider
   *
   * @description
   * Provider for {@link mfwi.notifications.push.service:$mfwiPush `$mfwiPush`} service.
   */
  PushModule.provider('$mfwiPush', pushProvider);
  function pushProvider() {
    var token = undefined;
    var registrationPromise = undefined;

    var pushOptions = {
      enabled: false
    };

    /**
     * @ngdoc function
     * @name mfwi.notifications.push.$mfwiPushProvider#config
     * @methodOf mfwi.notifications.push.$mfwiPushProvider
     *
     * @description
     * Configures push message registration.
     *
     * Read {@link https://github.com/phonegap/phonegap-plugin-push/blob/master/docs/API.md official docs} for
     * more options.
     *
     * @param {object} options Options
     * @param {boolean} options.enabled Whether push notifications are enabled (won't try to register if disabled).
     */
    this.config = function (options) {
      angular.extend(pushOptions, options || {});
    };

    this.$get = ['$log', '$q', '$window', '$rootScope', '$ionicPlatform', '$cordovaPushV5', function ($log, $q, $window, $rootScope, $ionicPlatform, $cordovaPushV5) {
      /**
       * @ngdoc service
       * @name mfwi.notifications.push.service:$mfwiPush
       *
       * @description
       * Push service for Ionic applications.
       *
       * It wraps all events broadcasted to `$rootScope` and offers a callback-based API.
       */
      var service = {
        init: init,
        push: $cordovaPushV5,
        getToken: getToken,
        onNotificationReceived: onNotificationReceived,
        onNotificationError: onNotificationError
      };
      return service;

      //////////////////

      /**
       * @ngdoc method
       * @name mfwi.notifications.push.service:$mfwiPush#init
       * @methodOf mfwi.notifications.push.service:$mfwiPush
       * @private
       *
       * @description
       * Initializer method, to be called when module is loaded.
       *
       * It registers for push notifications, if {@link mfwi.notifications.push.$mfwiPushProvider#config enabled}, once Ionic is ready.
       */
      function init() {
        registrationPromise = $q.defer();

        $ionicPlatform.ready(function () {
          if ($window.cordova && pushOptions.enabled) {
            $cordovaPushV5.initialize(pushOptions)
              .then(function () {
                // Start listening for new notifications
                $cordovaPushV5.onNotification();
                // Start listening for errors
                $cordovaPushV5.onError();

                // Register to get registrationId
                $cordovaPushV5.register()
                  .then(function (data) {
                    $log.log('Received push registration data', data);
                    // `data.registrationId` save it somewhere;
                    token = data.registrationId;
                  }, function onError() {
                    $log.log('Error registrating push with info', arguments);
                  })
                  .then(registrationPromise.resolve, registrationPromise.reject);
              }, function onError() {
                $log.log('Error initializing push with info', arguments);
              });
          }
        });
      }

      /**
       * @ngdoc method
       * @name mfwi.notifications.push.service:$mfwiPush#getToken
       * @methodOf mfwi.notifications.push.service:$mfwiPush
       *
       * @description
       * Returns the push token received by device's push platform.
       *
       * @returns {Promise<String>} Promise that will resolve once registered to push platform.
       */
      function getToken() {
        return registrationPromise.promise;
      }

      /**
       * @ngdoc method
       * @name mfwi.notifications.push.service:$mfwiPush#onNotificationReceived
       * @methodOf mfwi.notifications.push.service:$mfwiPush
       *
       * @description
       * Registers a callback function to be executed when a push message is received.
       *
       * Sugar helper that register for `$rootScope` broadcast event `$cordovaPushV5:notificationReceived`.
       *
       * @param {Function} cb Callback function.
       */
      function onNotificationReceived(cb) {
        $rootScope.$on('$cordovaPushV5:notificationReceived', function (event, data) {
          cb(event, data);
        });
      }

      /**
       * @ngdoc method
       * @name mfwi.notifications.push.service:$mfwiPush#onNotificationError
       * @methodOf mfwi.notifications.push.service:$mfwiPush
       *
       * @description
       * Registers a callback function to be executed when an error occurs in the push registration process.
       *
       * Sugar helper that register for `$rootScope` broadcast event `$cordovaPushV5:errorOcurred`.
       *
       * @param {Function} cb Callback function.
       */
      function onNotificationError(cb) {
        // triggered every time error occurs
        $rootScope.$on('$cordovaPushV5:errorOcurred', function (event, e) {
          cb(event, e);
        });
      }
    }];
  }
})();
