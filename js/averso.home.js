/*
	Author: Adam Trimble
*/

jQuery.noConflict();

var averso = (function($) {

	var sections = $('section'),
		weddingDay = new Date( $('#wedding-time').attr('datetime') ),
		weddingInterval = setInterval(updateCountdown, '333');

	function initThis() {
		updateCountdown();
		initRSVP();
		initNavButton();
		updateSectionSizing();
		$(window).on('resize', updateSectionSizing);
		initPageScroll();
	}

	function updateCountdown() {
		var now = new Date(),
			diff = weddingDay - now,
			days = Math.floor( diff / (1000*60*60*24) ),
			hours = Math.floor( diff / (1000*60*60) ),
			mins  = Math.floor( diff / (1000*60) ),
			secs  = Math.floor( diff / 1000 ),
			mo = Math.floor( days / 31 ),
			dd = days - mo * 31,
			hh = hours - days * 24,
			mm = mins - hours * 60,
			ss = secs - mins * 60,
			wed = $('#until-wedding');

		wed.find('.months').html( mo );
		wed.find('.days').html( dd );
		wed.find('.hours').html( hh );
		wed.find('.minutes').html( mm );
		wed.find('.seconds').html( ss );
	}

	function initNavButton() {
		sections.each(function(ind, ele) {
			if (ind === sections.length-1) {
				return false;
			}
			var navBtn = $('<nav>'),
					nextEle = $(ele).next();
			navBtn.on('click', function(e) {
				$(window).scrollTo(nextEle.data('fromTop'), 800);
			});
			$(ele).find('.container').append(navBtn);
		});
	}

	function updateSectionSizing() {
		if ($('html').hasClass('touch')) { return false; }
		windowHeight = $(window).height(),
		windowWidth = $(window).width(),
		pageHeight = 0;

		sections.height(windowHeight);
		sections.each(function(ind, ele) {
			var container = $(ele).find('.container'),
				contentHeight = container.height(),
				offset = ( windowHeight - contentHeight ) / 2 - 7,
				sectionHeight;
			if ( offset < 10 ) {
				$(ele).height( contentHeight + 50 );
				$(container).css({'marginTop': -10});
				sectionHeight = contentHeight + 50;
			} else {
				$(container).css({'marginTop': offset});
				sectionHeight = $(ele).height();
			}
			$(ele).data('fromTop', pageHeight);
			pageHeight += sectionHeight;
		});
		$('body').data('pageHeight', pageHeight);
		$('.slider').height( pageHeight );
		onPageScroll();
	}

	function initRSVP() {
		inputTips();
		$('#rsvp-submit').on('click', function() {
			var code = $('#rsvp-input').val();
			if ( code.match(/4l4n9|d4n19/i) ) {
				var iframeSRC = code.match(/4l4n9/i) ? 'rsvp-1' : 'rsvp-2';
				$('.code').fadeOut('fast', function() {
					var frameWidth = '',
						frameHeight = '';
					if ($(window).width() > 520) {
						frameWidth = '348px';
						frameHeight = '325px';
						iframeSRC += '.html';
					} else {
						frameWidth = '300px';
						frameHeight = '340px';
						iframeSRC += '-mobile.html';
					}
					var iframe = $('<iframe>', {
						'src': iframeSRC,
						'width': frameWidth,
						'height': frameHeight
					}).prependTo('.inner-form');
					updateSectionSizing();
				});
			} else {
				$('#rsvp-input').val('');
				$('#rsvp-input').blur();
				var error = $('<div>', { 'class': 'error' });
				error.html('<figure><img src="img/error-icon.png" alt="Error Icon"></figure>Invalid code. <a href="mailto:">Email the couple</a> for help.');
				error.appendTo('.code');
			}
		});
	}

	function inputTips() {
		var textBoxes = $(':text');
		textBoxes.each(function(ind, ele) {
			$(ele).val( $(ele).attr('title') );
		});
		textBoxes.focus(function(e) {
			if ($(this).hasClass('entered')) {
				return false;
			} else {
				$(this).val('').addClass('entered');
			}
		});
		textBoxes.blur(function(e) {
			var value = $(this).val(),
					title = $(this).attr('title');
			if ( value.length === 0 || value === title ) {
				$(this).removeClass('entered');
				$(this).val(title);
			} else {
				$(this).addClass('entered');
			}
		});
	}

	function initPageScroll() {
		if ($('html').hasClass('touch')) {
			sections.each(function(ind, ele) {
				$(ele).css( 'z-index', sections.length - ind );
				var bp;
				if ($(ele).attr('id') === "their-story") { bp = '0 -19px'; } else { bp = '0 0'; }
				$(ele).find('.edge').css({
					'height': '19px',
					'bottom': '-19px',
					'backgroundPosition': bp
				});
			});
		} else {
			var slider = $('<div>', {
				'class': 'slider'
			});
			slider.height( $('body').data('pageHeight') );
			slider.prependTo('body');
			sections.each(function(ind, ele) {
				$(ele).css({
					'position': 'absolute',
					'top': 0,
					'z-index': sections.length - ind
				});
			});
			$(window).scroll(onPageScroll);
			onPageScroll();
		}
	}

	function onPageScroll(e) {
		var activeInd = getActiveSection();
		if (activeInd === undefined) {
			activeInd = sections.length;
		}
		var activeSection = sections.eq( activeInd ),
				prevSections = $('section:lt('+activeInd+')'),
				nextSections = $('section:gt('+(activeInd)+')');
		nextSections.css({
			'position': 'fixed',
			'top': 0
		});
		activeSection.css({
			'position': 'absolute',
			'top': activeSection.data('fromTop')
		});
		prevSections.each(function(ind, ele) {
			$(ele).css({
				'position': 'absolute',
				'top': $(ele).data('fromTop')
			});
		});
	}

	function getActiveSection() {
		var scrollTop = $(window).scrollTop(),
			active;
		sections.each(function(ind, ele) {
			var fromTop = $(ele).data('fromTop');
			if (scrollTop > fromTop && scrollTop < fromTop + $(ele).height() ) {
				active = ind;
				return false;
			}
		});
		return active;
	}

	return {
		init: initThis
	};

})(jQuery);

jQuery(document).ready(averso.init);