'use strict';

angular.module('GameEngine', [])

.controller('GameCtrl', ['$scope', 'logService', 'cameraService', 'buildingService', function ($scope, logService, cameraService, buildingService) {

	$scope.getLog = function() {
		return logService.getLog();
	}

	$scope.addEntry = function(message, entryType) {
		logService.addEntry(message, entryType);
	}

	//Map---------------------------------------------------

	$scope.WORLD_MAP_SIZE = 10;
	$scope.CELL_SIZE = 60;

	$scope.cameraPosition = {x:0,y:0}

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
			'width' : mapHypotenuse + 'px', 
			'height' : mapHypotenuse/2 + 'px', //Divided by two to account for flattening
			'left' : cameraService.cameraPos().xPos + 'px',
			'top' : cameraService.cameraPos().yPos + 'px'
		};
	}

	//Build-------------------------------------------------

	$scope.selectedBuilding = 'test';

	$scope.setSelectedBuilding = function(name) {
		$scope.selectedBuilding = name;
	}

	$scope.cellClick = function(x, y) {
		if ($scope.selectedBuilding) {
			$scope.worldMap[x][y] = buildingService.getBuilding($scope.selectedBuilding);
			console.log($scope.worldMap[x][y])
		}

		//console.log(x + ', ' + y);
		$scope.addEntry(x + ', ' + y + ' clicked.', '');
	}

	$scope.getBuildings = function() {
		return buildingService.getBuildings();
	}

	$scope.getBuilding = function(buildingName) {
		return buildingService.getBuilding(buildingName); 
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
}])

.service('cameraService', [function () {
	this.currentCameraPos =  { xPos:0 , yPos:0 };

	this.resetCameraPos = function(){
		this.currentCameraPos =  { xPos:0 , yPos:0 };
	}

	this.cameraPos = function(newCameraPos) {

		if(newCameraPos != undefined) {
			this.currentCameraPos.xPos += newCameraPos.x;
			this.currentCameraPos.yPos += newCameraPos.y;
		}

		return this.currentCameraPos;
	}
}])

.service('buildingService', [function () {
	this.buildings = {
		house: {
			title: 'house',
			spritePath: 'house_placeholder'
		},

		fishingHut: {
			title: 'Fishing hut',
			spritePath: ''
		}
	}

	this.getBuilding = function(buildingName) {
		if(this.buildings[buildingName]) {
			return this.buildings[buildingName]
		}
	}

	this.getBuildings = function() {
		return this.buildings;
	}
}])

.directive('keypressEvents', 
	['$document', '$rootScope', 'cameraService',
 	function($document, $rootScope, cameraService) {
    return {
      restrict: 'A',
      link: function() {
        $document.bind('keypress', function(e) {
          console.log('Got keypress:', e.which);
          if (e.which === 119) {
          	cameraService.cameraPos({x:0,y:10});
          }
          else if (e.which === 97) {
          	cameraService.cameraPos({x:10,y:0});
          }
          else if (e.which === 115) {
          	cameraService.cameraPos({x:0,y:-10});
          }
          else if (e.which === 100) {
          	cameraService.cameraPos({x:-10,y:0});
          }
          else if (e.which === 32) {
          	cameraService.resetCameraPos();
          }

          $rootScope.$apply();
        });
      }
    };
  }
]);