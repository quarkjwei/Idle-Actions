var inactivityTime = function () {
	window.onblur = blurText;
	window.onclick = clickPage;

	console.log("idleTime: " + self.options.time);
	console.log("idleUnit: " + self.options.unit);
	console.log("idleUrlList: " + self.options.urlList);

	function blurText(){
		alert("blur event detected");
		window.onblur = '';
	}

	function clickPage()
	{
	 alert("click event detected!");
	}
}

inactivityTime();
