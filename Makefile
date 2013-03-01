test:
	@NODE_ENV=test ./node_modules/.bin/mocha

dev:
	@NODE_ENV=development npm start

.PHONY: test
