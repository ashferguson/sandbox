'use strict';

var app = angular.module('redditComments', []);

app.controller('MainController', function($scope, Comments){

    //On page load - retrieve all react threads
    (function getAllThread( ){
       Comments.getTitles().then(function(data){
           $scope.commentList = data;
       });

   })();

    //when user clicks on title, get all the comments associated with it
    $scope.getList = function(id, index) {
        //if user selects same thread as prior, do not do another call
        if($scope.selected === index){
            return;
        }
        $scope.selected = index;
        Comments.getComments(id).then(function (data) {
            $scope.commentList[index].comments = data[1].data.children;
            //error handling for when no comments are available
            if(!data[1].data.children.length){
                $scope.commentList[index].comments.push({data:{body: 'No Comments'}});

            }
        });
        //default params for sorting
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
    };

    //close comment boxes it user selects different thread
    $scope.$watch('selected', function (newValue, oldValue){
        if(oldValue === undefined){
            oldValue = newValue;
        }
        else if(newValue){
            $scope.commentList[oldValue].comments = [];
        }
    });

    //error modal for voting - no voting is allowed
    $scope.votingModal = function(){
        var modal = document.getElementById('votingError');

        //open modal
        modal.style.display = "block";

        //close modal by x
        var span = document.getElementsByClassName("close")[0];
        span.onclick = function() {
            modal.style.display = "none";
        }
        //close modal by clicking anywhere
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }
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