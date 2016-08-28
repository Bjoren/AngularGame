'use strict';

angular.module('GameEngine', [])

.controller('GameCtrl', ['$scope', 'logService', function ($scope, logService) {

	$scope.getLog = function() {
		return logService.getLog();
	}
}])

.service('logService', [function () {
	var MAX_LOG_ENTRIES = 50;
	this.log = [{message: 'test', type: 'alarm'}];

	this.addEntry = function(entryMessage, entryType) {
		if(this.log.push({message: entryMessage, type: entryType}) > MAX_LOG_ENTRIES) {
			this.log.shift();
		}
	}

	this.getLog = function() {
		this.scrollDown();
		return this.log;
	}

	this.scrollDown = function() {
		var element = document.getElementById("logContainer");
		element.scrollTop = element.scrollHeight;
	}
}]);