(function() {

	'use strict';
	
	var daveChat = angular.module('DaveChat')

	.factory('auth', function () {
		var savedAccount = JSON.parse(localStorage.getItem('account'));
		var account = (savedAccount == null) ? {} : savedAccount;

		var setAccount = function(inAccount) {
			localStorage.setItem("account", JSON.stringify(inAccount));
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