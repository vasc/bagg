"use strict";

require("babelify/polyfill");


angular.module("bbag", ["ngRoute"])
  .config(function ($routeProvider, $locationProvider, $compileProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "views/main.html",
        controller: "MainCtrl"
      })
      .otherwise({
        redirectTo: "/"
      });

    // use the HTML5 History API
    $locationProvider.html5Mode(true);
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|data):/);
  })
  .constant("config", {
  })
  .run(function() {
    console.log("bbag initialized");
  });


require("./lib");
require("./services");
require("./directives");
require("./controllers");
