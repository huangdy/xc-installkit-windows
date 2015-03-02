// make the code self invoking
(function () {

    // configuration
    var timeOutDuration = 600000; // in milliseconds
    var defaultRedirectURL = '/uicds/login.html';

    // closure variables
    var currentURL = window.location;
    var timeoutID;

    // logout function
    function logout(redirectURL) {
		//console.log('logging out...');
        var xhr,
            redirectURL = redirectURL || defaultRedirectURL;

        // Internet Explorer
        if (window.ActiveXObject) {
			//console.log("clearing cache");
          xhr = new ActiveXObject("Microsoft.XMLHTTP");
          document.execCommand("ClearAuthenticationCache");
          window.location.href=redirectURL;
        }

        // most browsers...
        else if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
            xhr.open('GET', currentURL, true, 'logout', 'logout');
            window.location.href=redirectURL;
        }
    }

    // timer function
    resetFunction = function resetTimer() {
        window.clearTimeout(timeoutID);
        timeoutID = window.setTimeout(logout, timeOutDuration);
    }

    // start the clock
    timeoutID = window.setTimeout(logout, timeOutDuration);

    // click handler (must call after timeoutID as been set)
    // anytime there is a click event on document, reset the timer event
    window.addEventListener('click', resetFunction);

})(); // end self-invoking function