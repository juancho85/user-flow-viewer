'use strict';

/* Directives */
var module = angular.module('ufvApp.directives', []);

module.directive('dropable', function () {
    return{
        restrict: 'E',
        template: '<div class="drop-zone" ng-transclude></div>',
        replace: true,
        transclude: true,
        scope: {
            callback: "&"
        },
        link: function linkFn(scope, lElement, attrs) {
            lElement.bind('dragover', function (evt) {
                evt.stopPropagation();
                evt.preventDefault();
                evt.dataTransfer.dropEffect = 'copy';
            });

            lElement.bind('drop', function (evt) {
                evt.stopPropagation();
                evt.preventDefault();
                scope.$emit('statusChanged', 'started');
                // FileList object.
                var files = evt.dataTransfer.files;
                // files is a FileList of File objects. List some properties.
                var output = [];
                var f = files[0];
                // read file content
                var reader = new FileReader();
                reader.onload = (function () {
                    return function (e) {
                        // Render thumbnail.
                        var content = new String(e.target.result);
                        scope.$emit('statusChanged', 'read');
                        scope.callback({cont:content});
                        scope.$emit('statusChanged', 'parsed');
                    };
                })(f);
                reader.readAsBinaryString(f);
            });
        }
    }
});

module.directive('collapsibleTable', function () {
    return{
        restrict: "E",
        scope: {
            title: "@",
            id: "@"
        },
        controller: function($scope){
            $scope.collapsed = true;
            $scope.expandCollapse = function(){
                $scope.collapsed = !$scope.collapsed;
            }
        },
        transclude: true,
        templateUrl: "collapsibleTable.html"
    }
});