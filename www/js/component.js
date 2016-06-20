function cleanupModal($scope, arrModal) {
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        for (modal of arrModal) {
            modal.remove();
        }
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
        // Execute action
    });
}
