bin := ./node_modules/.bin

all: browserify

lint:
	@ $(bin)/eslint src/**/*.js test/**/*.js

browserify: lint
	@ $(bin)/browserify test/dom-utils/*.js > test/index.js

test: browserify
	@ if	[ "$(CI)" = "1" ] && \
				[ "$(SAUCE_USERNAME)" != "" ] && \
				[ "$(SAUCE_ACCESS_KEY)" != "" ]; \
	then \
		$(bin)/easy-sauce; \
	else \
		$(bin)/mocha-phantomjs test/index.html; \
	fi

.PHONY: all lint test
