$(document).ready(function() {

// Resize contents to fit window
	function onResize(){

		var w = $('body').width(),
			h = $('body').height(),
			size = Math.min( w, h )*0.1;

		$('body').css({
			'font-size': size+'px'
		});

		$('.centered').each(function(i,el){
			var $el = $(el),
					w = $el.parent().width(),
					h = $el.parent().height();
			var size = Math.min( w, h )*0.5;

			$el.css( {
				width: Math.round(size)+'px',
				height: Math.round(size)+'px',
				position: 'absolute',
				top: Math.round((h*0.5-size*0.5))+'px',
				left: Math.round((w*0.5-size*0.5))+'px'
			} );
		});

	}

	$(window).on('resize',onResize);
	onResize();

// Controls for opening and closing the dialogs
	function hideDialog () {
		$('.dialog').removeClass('visible');
	}

	$(document).on('keydown.close-dialog', function(e){
		// escape key hides the dialog
		if( e.keyCode === 27 ){
			hideDialog();
		}
	});

	// menu click hides the dialog
	$('.menu').on('click', function(){
		hideDialog();
	});

	// click outside hides the dialog
	$('.overlay-container').on('click', function(e) {
		if ($(e.target).hasClass('overlay-container')) {
			hideDialog();
		}
	});

	// clicking x icon hides dialog
	$('.close-dialog').on('click', function() {
		hideDialog();
	});

	// About Dialog
	$('#btn-about').on('click', function(){
		var $about = $('#about-box');
		if ($about.hasClass('visible') ){
			hideDialog();
		} else {
			hideDialog();
			$about.addClass( 'visible' );
		}
		return false;
	});

	// Settings Dialog
	$('#btn-settings').on('click', function(){
		var $box = $('#settings-box');
		if ($box.hasClass('visible')){
			hideDialog();
		}else{
			hideDialog();
			$box.addClass( 'visible' );
		}
		return false;
	});

	// Timer Dialog
	$( '#timer' ).on('click', function(){
		var $timer = $('#timer-dialog');
		if( $timer.hasClass('visible') ){
			hideDialog();
		}else{
			hideDialog();
			$timer.addClass( 'visible' );
		}
		return false;
	});

// Set custom texts
	$('#btn-setting-ok').on('click',function(){
		var newIn = $('#in-inhale').val();
		var newOut = $('#in-exhale').val();

		if (newIn) {
			$('.inhale').text(newIn);
		}
		if (newOut) {
			$('.exhale').text(newOut);
		}
		hideDialog();
	});

// Create shareable link for custom text
	function formatUrl(inhale, exhale) {
		var url = 'http://calm.af/?';
		inhale = inhale ? encodeURIComponent(inhale) : 'in';
		exhale = exhale ? encodeURIComponent(exhale) : 'out';

		url += 'inhale=' + inhale + '&';
		url += 'exhale=' + exhale;

		return url;
	}

	var inText, outText;

	$('#in-inhale, #in-exhale').on('keyup', function(e) {
		if (e.target.id === 'in-inhale') {
			inText = e.target.value;
		} else {
			outText = e.target.value;
		}

		$('#custom-link').val(formatUrl(inText, outText));

	});

	// One-click copy of custom link
	$('#custom-link').on('click', function() {
		$('#custom-link').select();
		var copied = document.execCommand("copy");
		if (copied) {
			$('#copy-success').show().fadeOut(3000);
		}

	});

// Parse custom text from url params
	function parseQuery(){
		// http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
		var parameters = {};
		location.search.substr(1).split("&").forEach(function(param) {
			var pair = param.split('=');
			parameters[pair[0]] = decodeURIComponent(pair[1]);
		});
		return parameters;
	}

	var query = parseQuery();
	var initInhale = query.inhale || 'in';
	var initExhale = query.exhale || 'out';

	$('.inhale').html(initInhale);
	$('#in-inhale').val(initInhale);

	$('.exhale').html( query.exhale );
	$('#in-exhale').val(initExhale);

	$('#custom-link').val(formatUrl(initInhale, initExhale));


// Helpers for time string formatting
	function secondsToTimeStr( value ){
		var m = Math.floor(value / 60);
		var s = Math.floor(value - m*60);
		if ( s < 10 ) { s = '0' + s; }
		return m+':'+s;
	}
	function timeStrToSeconds( value ){
		var parts = value.split(':');
		var m = parseInt( parts[0] );
		var s = parseInt( parts[1] );
		return 60 * m + s;
	}
	function formatTimerReadout (seconds) {
		var timestring = secondsToTimeStr(seconds);
		return timestring.length < 5 ? "0" + timestring : timestring;
	}

// Handling the timer
	var globalTimer = null;
	$('#btn-timer-set').on('click',function(){
		var $timer = $('#timer');
		if (globalTimer) {
			clearInterval(globalTimer);
		}

		// Get seconds for timer
		var timerSeconds = timeStrToSeconds($('#slider-time')[0].noUiSlider.get());
		var timerReadout = formatTimerReadout(timerSeconds);
		$timer.text(timerReadout);

		// Set interval
		globalTimer = setInterval(function() {
			timerSeconds = --timerSeconds;

			if (timerSeconds < 0) {
				clearInterval(globalTimer);
				$timer.text('complete');

				// Sound option
				if ($('#audio-setting').prop('checked')){
					$('#timer-chime')[0].play();
				}

			} else {
				timerReadout = formatTimerReadout(timerSeconds);
				$timer.text(timerReadout);
			}
		}, 1000)
		hideDialog();
	});

// Handling the time slider
	$(function(){
		noUiSlider.create($('#slider-time')[0], {
			start: '5:00',
			connect: 'lower',
			animate: true,
			animationDuration: 300,
			tooltips: true,
			format: {
				to: secondsToTimeStr,
				from: timeStrToSeconds
			},
			step: 10,
			range: {
				'min': 60,
				'max': 20 * 60
			}
		});
	});

	// Show the menu on pageload
	$(function(){
		$('.menu').removeClass('highlighted');
	});
});
