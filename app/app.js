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

	$scope.WORLD_MAP_SIZE = 20;
	$scope.CELL_SIZE = 60;

	$scope.worldMap = new Array($scope.WORLD_MAP_SIZE).fill().map(()=> new Array($scope.WORLD_MAP_SIZE));

	$scope.determineMapPosition = function() { //Decides adjustments to div-placements based on new content dimensions after rotation

		var mapSize = $scope.WORLD_MAP_SIZE * $scope.CELL_SIZE; //Get the map size
		var mapHypotenuse = Math.sqrt((mapSize * mapSize)*2); //Get the hypotenuse to know the width of the map rotated 45deg
		var mapOffCenter = (mapHypotenuse - mapSize)/2; //(New size - old size) divided by half to account for offput on each side
		
		return mapOffCenter;
	}

	$scope.getMapSize = function() {
		var mapSize = $scope.WORLD_MAP_SIZE * $scope.CELL_SIZE; //Get the map size
		return mapSize;
	}

	$scope.newMapSizeToJSON = function() { //30px = map cell dimensions
		var mapSize = $scope.getMapSize();
		var mapHypotenuse = Math.sqrt((mapSize * mapSize)*2); //Get the hypotenuse to know the width of the map rotated 45deg

		return {
			'width' : mapHypotenuse+'px', 
			'height' : mapHypotenuse/2+'px' //Divided by two to account for flattening
		};
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