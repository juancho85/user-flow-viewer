'use strict';

/* Filters */
angular.module('ufvApp.filters', []).
    filter('dateFilter', function() {
    var dateFilter = function(input) {
        if(input && input.getMonth){
            var hours = input.getHours();
            var minutes = input.getMinutes();
            var seconds = input.getSeconds();
            var milliseconds = input.getMilliseconds();
            if(hours < 9){
                hours = "0"+ hours;
            }
            if(minutes < 9){
                minutes = "0"+ minutes;
            }
            if(seconds < 9){
                seconds = "0"+ seconds;
            }
            if(milliseconds < 9){
                milliseconds = "00"+ milliseconds;
            }
            if(milliseconds < 100 && milliseconds > 9){
                milliseconds = "0"+ milliseconds;
            }

            var formattedDate = input.getFullYear() + '/' + input.getMonth() + '/' + input.getDate() + ' ' +
                hours + ':' + minutes + ':' + seconds + '.' + milliseconds;

            return formattedDate;
        }

        return input;

    };
    return dateFilter;
}).filter('urlFilter', function(){
        var urlFilter = function(input){
            if(input.indexOf('?')>0){
                var splitUrl = input.split('?');
                var url = splitUrl[0];
                var paramsPortion = splitUrl[1];
                var result = "";
                var param;
                if(paramsPortion && paramsPortion.length > 0){
                    param = paramsPortion.split('&');
                }
                for(var i=0; param && i < param.length; i++){
                    result+='\n' + param[i];
                }
                return url+result;
            }
            return input;
        }
        return urlFilter;
    }
);

