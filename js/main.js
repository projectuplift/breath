$(document).ready(function() {
// Resizing animation controls for text?
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

	// what are this? for closing the boxes?
	// TODO: Rework bc right now boxes only close if you click again on their icon
	// could be more intuitive, close when clicked outside the box
	$(document).on('keydown.close-dialog',function(e){
		// excape key, keep.
		if( e.keyCode === 27 ){
			$('.dialog').removeClass( 'visible' );
		}
	});

	$('.menu').on('click', function(){
		$('.dialog').removeClass( 'visible' );
	});

	$('#btn-about').on('click', function(){
		var $about = $('#about-box');
		if( $about.hasClass('visible') ){
			$about.removeClass( 'visible' );
		}else{
			$('.dialog').removeClass( 'visible' );
			$about.addClass( 'visible' );
		}
		return false;
	});
	$('#btn-settings').on('click', function(){
		var $box = $('#settings-box');
		if( $box.hasClass('visible') ){
			$box.removeClass( 'visible' );
		}else{
			$('.dialog').removeClass( 'visible' );
			$box.addClass( 'visible' );
		}
		return false;
	});

// Handler for setting custom inhale/exhale text
	$('#btn-setting-ok').on('click',function(){
		var newIn = $('#in-inhale').val();
		var newOut = $('#in-exhale').val();

		if (newIn) {
			$('.inhale').text(newIn);
		}
		if (newOut) {
			$('.exhale').text(newOut);
		}
		$('.dialog').removeClass('visible');
	});

// handling the timer
// TODO: Refactor this simpler. If we don't need to deal with actual timestrings we can probably do away with the date objects
	var globalTimer = null;
	var globalStartTime = 0;
	var globalEndTime = 0;
	$('#btn-timer-set').on('click',function(){
		if( globalTimer ){
			clearInterval( globalTimer );
		}
		globalStartTime = (new Date()).getTime();
		globalEndTime = (new Date()).getTime()+timeStrToSeconds($('#slider-time')[0].noUiSlider.get())*1000;
		globalTimer = setInterval( function(){
			var time = (new Date()).getTime();
			if( time > globalEndTime ){
				clearInterval( globalTimer );
				globalTimer = null;
				$('#timer').html('complete');
			}else{
				var remainingMs = globalEndTime - time;
				var seconds = remainingMs / 1000;
				var m = Math.floor(seconds / 60);
				var s = Math.floor(seconds - m*60);
				if( m < 10 ){ m = '0'+m; }
				if( s < 10 ){ s = '0'+s; }
				$('#timer').html(m+':'+s);
			}
		}, 30 );
		$('.dialog').removeClass( 'visible' );
	});

	function secondsToTimeStr( value ){
		var m = Math.floor(value / 60);
		var s = Math.floor(value - m*60);
		if( s < 10 ){ s = '0'+s; }
		return m+':'+s;
	}
	function timeStrToSeconds( value ){
		var parts = value.split(':');
		var m = parseInt( parts[0] );
		var s = parseInt( parts[1] );
		return 60*m + s;
	}

// handling the timer setter
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
				'min': 1 *60,
				'max': 20*60
			}
		});
	});
	$( '#timer' ).on('click', function(){
		var $timer = $('#timer-dialog');
		if( $timer.hasClass('visible') ){
			$timer.removeClass( 'visible' );
		}else{
			$('.dialog').removeClass( 'visible' );
			$timer.addClass( 'visible' );
		}
		return false;
	});

	// Show the about box when presented
	// May want to rework how that's happenning, idk.
	$(function(){
		$('.menu').removeClass('highlighted');
	});
});
