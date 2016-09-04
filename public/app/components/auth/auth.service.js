(function() {
	
	var daveChat = angular.module('DaveChat')

	.factory('auth', function () {
		var account;

		var setAccount = function(inAccount) {
        account = inAccount;
    };

    var getAccount = function() {
        return account? account : false;
    };

		return {
			setAccount: setAccount,
			getAccount: getAccount
		}; 
  });
})();