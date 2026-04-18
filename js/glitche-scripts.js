(function () {
	'use strict';

	var body = document.body;
	var header = document.querySelector('header');
	var mouseButton = document.querySelector('.mouse_btn');

	function collectTypedStrings(source) {
		return Array.from(source.children)
			.map(function (child) {
				return child.innerHTML;
			})
			.filter(function (value) {
				return value && value.trim().length > 0;
			});
	}

	function createCursor(target, showCursor) {
		var cursor;

		if (!showCursor) {
			return null;
		}

		cursor = document.createElement('span');
		cursor.className = 'typed-cursor';
		cursor.textContent = '|';
		target.insertAdjacentElement('afterend', cursor);
		return cursor;
	}

	function typeHtml(target, html, onDone) {
		var index = 0;
		var delay = 28;
		var text = html || '';

		function renderNext() {
			var nextIndex;

			if (index >= text.length) {
				onDone();
				return;
			}

			if (text.charAt(index) === '<') {
				nextIndex = text.indexOf('>', index);
				index = nextIndex === -1 ? text.length : nextIndex + 1;
			} else {
				index += 1;
			}

			target.innerHTML = text.slice(0, index);
			window.setTimeout(renderNext, delay);
		}

		renderNext();
	}

	function startTypewriter(target, source, options) {
		var strings;
		var currentIndex = 0;
		var showCursor = !options || options.showCursor !== false;
		var loop = !!(options && options.loop);

		if (!target || !source) {
			return;
		}

		strings = collectTypedStrings(source);
		if (!strings.length) {
			return;
		}

		source.style.display = 'none';
		source.setAttribute('aria-hidden', 'true');
		createCursor(target, showCursor);

		function renderString() {
			target.innerHTML = '';
			typeHtml(target, strings[currentIndex], function () {
				if (!loop) {
					return;
				}

				window.setTimeout(function () {
					currentIndex = (currentIndex + 1) % strings.length;
					renderString();
				}, 1200);
			});
		}

		renderString();
	}

	function initTypedText() {
		startTypewriter(
			document.querySelector('.typed-subtitle'),
			document.querySelector('.typing-subtitle'),
			{ loop: true }
		);

		startTypewriter(
			document.querySelector('.typed-bread'),
			document.querySelector('.typing-bread'),
			{ showCursor: false }
		);
	}

	function updateMouseButton() {
		if (!mouseButton) {
			return;
		}

		mouseButton.style.display = window.scrollY >= 1 ? 'none' : 'block';
	}

	function handleDelegatedClicks(event) {
		var link = event.target.closest('header .top-menu a, .typed-bread a');
		var menuButton = event.target.closest('header .menu-btn');
		var scrollButton = event.target.closest('.section .mouse_btn');

		if (menuButton && header) {
			event.preventDefault();
			header.classList.toggle('active');
			menuButton.setAttribute('aria-expanded', header.classList.contains('active') ? 'true' : 'false');
			return;
		}

		if (scrollButton) {
			event.preventDefault();
			window.scrollTo({
				top: Math.max(window.innerHeight - 150, 0),
				behavior: 'smooth'
			});
			return;
		}

		if (!link) {
			return;
		}

		if (!link.getAttribute('href') || link.getAttribute('href').charAt(0) === '#') {
			event.preventDefault();
			return;
		}

		event.preventDefault();
		window.setTimeout(function () {
			window.location.href = link.getAttribute('href');
		}, 250);
	}

	function handleButtonHover(event) {
		var button = event.target.closest('a.btn, .btn');

		if (!button) {
			return;
		}

		if (event.type === 'mouseover') {
			if (button.contains(event.relatedTarget)) {
				return;
			}
			button.classList.add('glitch-effect-white');
		}

		if (event.type === 'mouseout') {
			if (button.contains(event.relatedTarget)) {
				return;
			}
			button.classList.remove('glitch-effect-white');
		}
	}

	function init() {
		initTypedText();
		updateMouseButton();

		window.addEventListener('scroll', updateMouseButton);

		document.addEventListener('click', handleDelegatedClicks);
		document.addEventListener('mouseover', handleButtonHover);
		document.addEventListener('mouseout', handleButtonHover);
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();