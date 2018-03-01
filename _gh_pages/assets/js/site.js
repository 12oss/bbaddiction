/*async breaks my smooth scroll to....*/
/*function f1 is defined around everything so that I can async all js and then run all this code after page loads in*/
function f1() {
	/*HASH*/
	jQuery(function() {
		jQuery('a[href*=#]:not([href=#])').click(function() {
			if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {

				var target = jQuery(this.hash);
				target = target.length ? target : jQuery('[name=' + this.hash.slice(1) + ']');
				if (target.length) {
					jQuery('html,body').animate({
						scrollTop: target.offset().top + 30
					}, 1000);
					return false;
				}
			}
		});
	});
	/*end hash*/
	/*BACK TO TOP*/
	function checkOffset() {
		if ($('#back-to-top').offset().top + $('#back-to-top').height() >= $('.footer').offset().top - 10)
			$('#back-to-top').css('position', 'absolute');
		if ($(document).scrollTop() + window.innerHeight < $('.footer').offset().top)
			$('#back-to-top').css('position', 'fixed'); /*restore when you scroll up*/
	}
	$(document).scroll(function() {
		checkOffset();
	});
	$('#back-to-top').click(function() {
		$('html, body').animate({
			scrollTop: 0
		}, 800);
		return false;
	});

	$(window).scroll(function() {
		if ($(this).scrollTop() > 150) {
			$('#back-to-top').stop().fadeIn(250);
		} else {
			$('#back-to-top').stop().fadeOut(250);
		}
	});
	/*end BACK TO TOP*/

	/*ASYNC CSS FILES*/
	/*! loadCSS: load a CSS file asynchronously. [c]2016 @scottjehl, Filament Group, Inc. Licensed MIT */
	(function(w) {
		"use strict";
		/* exported loadCSS */
		var loadCSS = function(href, before, media) {
			/*Arguments explained:*/
			/*`href` [REQUIRED] is the URL for your CSS file.*/
			/*`before` [OPTIONAL] is the element the script should use as a reference for injecting our stylesheet <link> before
			By default, loadCSS attempts to inject the link after the last stylesheet or script in the DOM. However, you might desire a more specific location in your document.*/
			/* `media` [OPTIONAL] is the media type or query of the stylesheet. By default it will be 'all'*/
			var doc = w.document;
			var ss = doc.createElement("link");
			var ref;
			if (before) {
				ref = before;
			} else {
				var refs = (doc.body || doc.getElementsByTagName("head")[0]).childNodes;
				ref = refs[refs.length - 1];
			}

			var sheets = doc.styleSheets;
			ss.rel = "stylesheet";
			ss.href = href;
			/*temporarily set media to something inapplicable to ensure it'll fetch without blocking render*/
			ss.media = "only x";

			/*wait until body is defined before injecting link. This ensures a non-blocking load in IE11.*/
			function ready(cb) {
				if (doc.body) {
					return cb();
				}
				setTimeout(function() {
					ready(cb);
				});
			}
			/*Inject link*/
			/*Note: the ternary preserves the existing behavior of "before" argument, but we could choose to change the argument to "after" in a later release and standardize on ref.nextSibling for all refs*/
			/*Note: `insertBefore` is used instead of `appendChild`, for safety re: http://www.paulirish.com/2011/surefire-dom-element-insertion/*/
			ready(function() {
				ref.parentNode.insertBefore(ss, (before ? ref : ref.nextSibling));
			});
			/*A method (exposed on return object for external use) that mimics onload by polling document.styleSheets until it includes the new sheet.*/
			var onloadcssdefined = function(cb) {
				var resolvedHref = ss.href;
				var i = sheets.length;
				while (i--) {
					if (sheets[i].href === resolvedHref) {
						return cb();
					}
				}
				setTimeout(function() {
					onloadcssdefined(cb);
				});
			};

			function loadCB() {
				if (ss.addEventListener) {
					ss.removeEventListener("load", loadCB);
				}
				ss.media = media || "all";
			}

			/*once loaded, set link's media back to `all` so that the stylesheet applies once it loads*/
			if (ss.addEventListener) {
				ss.addEventListener("load", loadCB);
			}
			ss.onloadcssdefined = onloadcssdefined;
			onloadcssdefined(loadCB);
			return ss;
		};
		/* commonjs*/
		if (typeof exports !== "undefined") {
			exports.loadCSS = loadCSS;
		} else {
			w.loadCSS = loadCSS;
		}
	}(typeof global !== "undefined" ? global : this));

	/*css preload*/
	/*! CSS rel=preload polyfill. Depends on loadCSS function. [c]2016 @scottjehl, Filament Group, Inc. Licensed MIT  */
	(function(w) {
		/*rel=preload support test*/
		if (!w.loadCSS) {
			return;
		}
		var rp = loadCSS.relpreload = {};
		rp.support = function() {
			try {
				return w.document.createElement("link").relList.supports("preload");
			} catch (e) {
				return false;
			}
		};

		/*loop preload links and fetch using loadCSS*/
		rp.poly = function() {
			var links = w.document.getElementsByTagName("link");
			for (var i = 0; i < links.length; i++) {
				var link = links[i];
				if (link.rel === "preload" && link.getAttribute("as") === "style") {
					w.loadCSS(link.href, link);
					link.rel = null;
				}
			}
		};

		/*if link[rel=preload] is not supported, we must fetch the CSS manually using loadCSS*/
		if (!rp.support()) {
			rp.poly();
			var run = w.setInterval(rp.poly, 300);
			if (w.addEventListener) {
				w.addEventListener("load", function() {
					w.clearInterval(run);
				});
			}
			if (w.attachEvent) {
				w.attachEvent("onload", function() {
					w.clearInterval(run);
				})
			}
		}
	}(this));
	/*end ASYNC CSS FILES*/


}

/*runs everything after page loads*/
window.onload = f1;