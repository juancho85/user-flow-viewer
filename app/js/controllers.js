'use strict';

/* Controllers */
var module = angular.module('ufvApp.controllers', []);

function getFieldNames(input) {
    var fieldNamesArray = [];
    if (input) {
        for (var i = 0; i < input.length; i++) {
            var element = input[i];
            fieldNamesArray.push(element.name);
        }
    }

    return fieldNamesArray;
};

function supports_html5_storage() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}

module.controller('UserPreferencesController', function ($scope, FieldsInput, FieldsStatistic) {
    if (!supports_html5_storage()) {
        alert('Your browser does not support html5 storage. Your preferences cannot be saved.');
    }

    $scope.titles = {};

    FieldsInput.query(function (data) {
        $scope.titles.input = data;
    });

    FieldsStatistic.query(function (data) {
        $scope.titles.statistic = data;
    });

    $scope.savePreferences = function () {
        //Add to local storage
        localStorage.setItem('inputPreferences', JSON.stringify($scope.titles.input));
        localStorage.setItem('statisticPreferences', JSON.stringify($scope.titles.statistic));
        alert("Preferences saved");
    }

    $scope.resetPreferences = function () {
        //Remove from local storage
        localStorage.removeItem('inputPreferences');
        localStorage.removeItem('statisticPreferences');
        //Reload the defaults for the display to be updated with them
        FieldsInput.query(function (data) {
            $scope.titles.input = data;
        });
        FieldsStatistic.query(function (data) {
            $scope.titles.statistic = data;
        });
        alert("Defaults restored");
    }

});

module.controller('PrettyLogsController', function ($scope, $http, $filter, FieldsInput, FieldsStatistic) {
    $scope.titles = {};

    $scope.loading = false;

    $scope.$on('statusChanged', function(ev, data){
        if(data === 'started' || data === 'read'){
            $scope.$apply(function(){
                $scope.loading = true;
            });
        }
        if(data === 'parsed'){
            $scope.$apply(function(){
                $scope.loading = false;
            });
        }
    });

    //if user preferences are defined, use then, otherwise default on json files
    var userPreferencesInput = localStorage.getItem('inputPreferences');
    if (userPreferencesInput) {
        //transform String to object
        var pref = JSON.parse(userPreferencesInput);
        $scope.titles.input = pref;
        $scope.inputFields = getFieldNames(pref);
    } else {
        FieldsInput.query(function (data) {
            var inPref = localStorage.getItem('inputPreferences');
            $scope.titles.input = data;
            $scope.inputFields = getFieldNames(data);
        });
    }

    var userPreferencesStatistic = localStorage.getItem('statisticPreferences');
    if (userPreferencesStatistic) {
        //transform String to object
        var pref = JSON.parse(userPreferencesStatistic);
        $scope.titles.statistic = pref;
        $scope.statisticFields = getFieldNames(pref);
    } else {
        FieldsStatistic.query(function (data) {
            var inPref = localStorage.getItem('statisticPreferences');
            $scope.titles.statistic = data;
            $scope.statisticFields = getFieldNames(data);
        });
    }

    $scope.resetDisplay = function(){
        $scope.contents = {};
    }

    $scope.changeDisplay = function(layout){
        $scope.display = layout;
    }

    $scope.highlightInput = function (evt, index) {
        if ($scope.contents && $scope.contents.statistic && $scope.contents.statistic.length > 0) {
            var statisticIndexArray = [];
            var myInput = $scope.contents.input;
            var myStatistic = $scope.contents.statistic;
            for (var i = 0; i < myStatistic.length; i++) {
                if (myStatistic[i].timestamp >= myInput[index].timestamp) {
                    statisticIndexArray.push(i);
                }
            }
            findRowsAndHighlight(statisticIndexArray, 'statistic');
        }
        highlightRow(evt.currentTarget);
    }

    $scope.highlightStatistic = function (evt, index) {
        if ($scope.contents && $scope.contents.input && $scope.contents.input.length > 0) {
            var inputIndexArray = [];
            var myInput = $scope.contents.input;
            var myStatistic = $scope.contents.statistic;

            for (var i = 0; i < myInput.length; i++) {
                if (myInput[i].timestamp <= myStatistic[index].timestamp) {
                    inputIndexArray.push(i);
                }
            }
            findRowsAndHighlight(inputIndexArray, 'input');

        }
        highlightRow(evt.currentTarget);
    }

    $scope.formatLine = function (cont) {
        if(cont){
            var inputChunk = getInputChunkFromContent(cont);
            var inputLines = formatLines(inputChunk, $scope.formatInputLine);
            var statsChunk = getStatsChunkFromContent(cont);
            var statsLines = formatLines(statsChunk, $scope.formatStatisticLine);

            $scope.contents.input = inputLines;
            $scope.contents.statistic = statsLines;
            $scope.contents.show = true;
            $scope.$apply();
        }
    }

    $scope.formatInputLine = function (line) {
        var stringArray = line.split(";");
        var date = createDate(stringArray[0])
        stringArray[0] = date;
        var inputObj = {};
        var fields = getFieldNames($scope.titles.input);
        for (var i = 0; i < stringArray.length; i++) {
            inputObj[fields[i]] = stringArray[i];
        }
        return inputObj;
    }

    $scope.formatStatisticLine = function (line) {
        var stringArray = line.split(";");
        var date = createDate(stringArray[1]);
        stringArray[1] = date;
        stringArray.splice(0, 1);
        var statisticObj = {};
        var fields = getFieldNames($scope.titles.statistic);

        for (var i = 0; i < stringArray.length; i++) {
            statisticObj[fields[i]] = stringArray[i];
        }

        return statisticObj;
    }

    $scope.contents = {};
    $scope.contents.show = false;

    //default display and nTables
    $scope.display = 'horizontal';
    $scope.nTables = 2;
});


//Helpers for table manipulation
function findRowsAndHighlight(indexArray, tableId) {
    var table = document.getElementById(tableId);
    var rows = table.getElementsByTagName('tr');
    clearAllHighlight(['input','statistic']);
    //we loop through the rows, not counting the header (start from 1)
    for (var i = 1; i < rows.length; i++) {
        //The indexes in indexArray are only for content, header not included (that is why we make i-1)
        if (indexArray.indexOf(i-1) > -1) {
            highlightRow(rows[i]);
        }
    }
}

function clearAllHighlight(tableIdArray) {
    for (var i = 0; i < tableIdArray.length; i++) {
        var table = document.getElementById(tableIdArray[i]);
        var rows = table.getElementsByTagName('tr');
        for (var j = 0; j < rows.length; j++) {
            removeHighlightRow(rows[j]);
        }
    }
}

function removeHighlightRow(tr) {
    for (var i = 0; i < tr.childNodes.length; i++) {
        var obj = tr.childNodes[i];
        if (obj.className && obj.className.indexOf("selected") != -1) {
            obj.className = obj.className.replace('selected', '');
        }
    }
}

function highlightRow(tr) {
    for (var i = 0; i < tr.childNodes.length; i++) {
        var obj = tr.childNodes[i];
        if (obj.className && obj.className.indexOf("selected") != -1) {
            obj.className = obj.className.replace('selected', '');
        } else {
            obj.className = obj.className + " " + "selected";
        }
    }
    ;
}

//Helper functions for reading the file
function getInputChunkFromContent(content) {
    var inputRegex = /input((?!(\r\n|\n){2,})[\s\S])+/g;
    var inputPiece = content.match(inputRegex);
    var lines = inputPiece[0].split("\n");
    //remove unnecessary information prefix used for the regex
    lines.splice(0, 1);
    return lines;
}

function getStatsChunkFromContent(content) {
    var statsRegex = /statistic((?!(\r\n|\n){2,})[\s\S])+/g;
    var statsPiece = content.match(statsRegex);
    var lines = statsPiece[0].split("\n");
    //remove unnecessary information prefix used for the regex
    lines.splice(0, 1);
    return lines;
}

function formatLines(lineArray, formatLineFunction) {
    var result = [];
    for (var inIndex = 0, lineString; inIndex < lineArray.length; inIndex++) {
        lineString = lineArray[inIndex]
        lineString = lineString.trim();
        if (lineString.length > 0) {
            var token = formatLineFunction(lineString);
            result.push(token);
        }
    }
    return result;
}

function createDate(stringDate) {
    var date = new Date(
        stringDate.substring(0, 4),//year
        stringDate.substring(4, 6),//month
        stringDate.substring(6, 8),//day
        stringDate.substring(8, 10),//hour
        stringDate.substring(10, 12),//minute
        stringDate.substring(12, 14),//second
        stringDate.substring(14, 17)//miliseconds
    );
    return date;
}