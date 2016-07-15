var RegistrationComponent = function (_rootDivId, eventBus) {

	var _initialize = function () {
		var registrationBoxId = _rootDivId + "_box";
		var root = document.getElementById(_rootDivId);
		root.innerHTML =
			'<div id="' + registrationBoxId + '" class="registration-box"></div>';
		var registrationBoxComponent = new RegistrationBoxComponent(registrationBoxId);
		registrationBoxComponent.initBox();

	};

	var _displayRegistrationError = function (failRegistrationEvent) {
		var errorElementRootId = _rootDivId + "_box_error";
		var errorElement = document.getElementById(errorElementRootId);
		errorElement.innerHTML = '<p style="color:red">' + failRegistrationEvent.message + '</p>'
	};

	var RegistrationBoxComponent = function (_boxDivId) {

		var _initBox = function () {

			var boxRoot = document.getElementById(_boxDivId);

			var buttonId = _boxDivId + "_button";

			var nicknameInputId = _boxDivId + "_nickname";

			var passwordInputId = _boxDivId + "_password";

			var confirmPasswordInputId = _boxDivId + "_confirm_password";

			boxRoot.innerHTML = 'Nickname:<br>' +
				'<input type="text" name="nickname" id="' + nicknameInputId + '">' +
				'<br>' +
				'Password:<br>' +
				'<input type="password" name="password" id="' + passwordInputId + '">' +
				'<br>' +
				'Confirm password:<br>' +
				'<input type="password" name="confirmPassword" id="' + confirmPasswordInputId + '">' +
				'<br>' +
				'<div id = ' + _boxDivId + "_error" + '></div><br>' +
				'<button id="' + buttonId + '">Register</button>';


			var button = document.getElementById(buttonId);

			button.onclick = function () {

				var nicknameInput = document.getElementById(nicknameInputId);
				var passwordInput = document.getElementById(passwordInputId);
				var confirmPasswordInput = document.getElementById(confirmPasswordInputId);

				var newUserData = {
					newNickname: nicknameInput.value,
					newUserPassword: passwordInput.value,
					newUserConfirmationPassword: confirmPasswordInput.value
				};

				eventBus.post("addUser", newUserData);
				console.log("User's " + newUserData.newNickname + " posted");
			}

		}
		return {"initBox": _initBox};
	}



	return {"init": _initialize,
			"showError": _displayRegistrationError};
}

if (typeof define !== 'function') { 
	var define = require('amdefine')(module);
}

define(function() {
	return RegistrationComponent;
});

