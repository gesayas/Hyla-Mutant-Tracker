var missionControl = angular.module("missionControl", []);

missionControl.controller("missionController", ["$scope", "$compile", "$http", function($scope, $compile, $http) {

	$scope.traitNumTracker = [1, 1]; // [numAbilities for mutant, numDetails for event]

	$http.get("data/elements.json").then(function(response) {
		$scope.elementLists = response.data;
	});

	$scope.slide = function(id) {
		if ($(id).is(":hidden")) {
			$(id).slideDown(100);
		} else {
			$(id).slideUp(100);
		}
	};

	$scope.addTrait = function(id, placeHolder, index) {
		var field = document.createElement("input");
		field.setAttribute("placeholder", placeHolder + $scope.traitNumTracker[index]);
		$scope.traitNumTracker[index]++;
		document.getElementById(id).appendChild(field);
	};

	$scope.addElement = function(id, name, elements, inputId, index) {
		var element = {"name": name};
		var children = document.getElementById(id).children;
		for (i = 0; i < children.length; i++) {
			element[children[i].getAttribute("placeholder")] = children[i].value;
		}
		$scope.elementLists[elements].push(element);
		document.getElementById(inputId).value = "";
		var container = document.getElementById(id);
		while (container.lastChild) {
			container.removeChild(container.lastChild);
		}
		$scope.traitNumTracker[index] = 1;
	};

	$scope.countMatches = function(mutant) {
		var count = 0;
		for (var property in mutant) {
			if (mutant.hasOwnProperty(property) &&
				property != "name" &&
				mutant[property].toLowerCase().indexOf($scope.mutantAbility.toLowerCase()) >= 0) {
				count++;
			}
		}
		return count;
	};

	$scope.updateShowing = function() {
		var container = document.getElementById("mutantContainer");
		while (container.lastChild) {
			container.removeChild(container.lastChild);
		}
		if ($scope.mutantAbility != undefined && $scope.mutantAbility.length > 2) {
			$scope.elementLists["mutants"].sort(function(a, b) {
				return $scope.countMatches(a) - $scope.countMatches(b);
			});
			for (i = $scope.elementLists["mutants"].length - 1; i >= 0 && $scope.countMatches($scope.elementLists["mutants"][i]) > 0; i--) {
				var tr = "<tr><td><button type=\"button\" class=\"addButton\" ng-click=\"assembleMutant(" + i + ")\">Assemble</button></td><td>" + "</td>";
				for (var property in $scope.elementLists["mutants"][i]) {
					tr += "<td>" + $scope.elementLists["mutants"][i][property] + "</td>";
				}
				tr += "</tr>";
				var toAdd = $compile(tr)($scope);
				angular.element(container).append(toAdd);
			}
		}
	};

	$scope.assembleMutant = function(index) {
		var container = document.getElementById("team");
		var tr = "<tr>";
		for (var property in $scope.elementLists["mutants"][index]) {
			tr += "<td>" + $scope.elementLists["mutants"][index][property] + "</td>";
		}
		tr += "</tr>";
		container.innerHTML += tr;
	};
}]);