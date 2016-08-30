'use strict';

angular.module('GameEngine', [])

.controller('GameCtrl', ['$scope', 'logService', function ($scope, logService) {

	$scope.getLog = function() {
		return logService.getLog();
	}

	$scope.addEntry = function(message, entryType) {
		logService.addEntry(message, entryType);
	}

	//Map---------------------------------------------------

	$scope.WORLD_MAP_SIZE = 16;

	$scope.worldMap = new Array($scope.WORLD_MAP_SIZE).fill().map(()=> new Array($scope.WORLD_MAP_SIZE));

	$scope.determineMapPosition = function() { //Decides adjustments to div-placements based on new content dimensions after rotation
		/*return {
			'top' : x+'px'
			'left' : x+'px'
		};*/
	}

	$scope.determineMapSize = function() { //30px = map cell dimensions
		return {
			'width' : $scope.WORLD_MAP_SIZE * 30+'px', 
			'height' : $scope.WORLD_MAP_SIZE * 30+'px'
		}
	}

	//Build-------------------------------------------------

	$scope.selectedBuilding = undefined;

	$scope.cellClick = function(x, y) {
		console.log(x + ', ' + y);
		$scope.addEntry(x + ', ' + y + ' clicked.', '');
	}
}])

.service('logService', [function () {
	var MAX_LOG_ENTRIES = 50;

	//Log---------------------------------------------------

	this.log = [{message: 'test', type: 'alert'}];

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