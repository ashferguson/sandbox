'use strict';

var app = angular.module('redditComments', []);

app.controller('MainController', function($scope, Comments){
    //
    (function getAllThread( ){
       Comments.getTitles().then(function(data){
           $scope.commentList = data;
       });
   })();


    $scope.getList = function(id, index) {
        if($scope.selected === index){
            return;
        }
        $scope.selected = index;
        Comments.getComments(id).then(function (data) {
            $scope.commentList[index].comments = data[1].data.children;
            if(!data[1].data.children.length){
                $scope.commentList[index].comments.push({data:{body: 'No Comments'}});

            }

        });

        $scope.commentList[index].property = 'ups';
        $scope.commentList[index].order = 'desc';




    };

    $scope.setSort= function(idx){
        $scope.property = $scope.commentList[idx].property;
    };

    $scope.setOrder = function(idx){
        var order = $scope.commentList[idx].order;
        if(order === 'asc'){
            $scope.order = true;
        }
        else{
          $scope.order = false;
        }

    }

    $scope.$watch('selected', function (newValue, oldValue){
        if(oldValue === undefined){
            oldValue = newValue;
        }
        else if(newValue){
            $scope.commentList[oldValue].comments = [];
        }
    });

})

app.service('Comments', function($q, $http){
    function getTitles() {
        return $http({
            method: "get",
            url: "http://www.reddit.com/r/reactjs.json "

        }).then(function success(data){
            return data.data.data.children;
        }, function(error){
            return error;
        })
    }
    function getComments(id){
        return $http({
            method: "get",
            url: "http://www.reddit.com/r/reactjs/" + id + '.json'

        }).then(function success(data){
            return data.data
        }, function(error){
            return error;
        })
    }

    return {
        getTitles: getTitles,
        getComments: getComments
    }
})