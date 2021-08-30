
test:
	@./node_modules/.bin/mocha \
		--require should \
		--reporter dot \
		--bail

bench:
	@./node_modules/.bin/_matcha \
		benchmarks/index.js

.PHONY: test bench