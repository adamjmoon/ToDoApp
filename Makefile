BIN = ./node_modules/.bin
TEST_SERVER = ./assets/javascripts/test/testServer
install:
	npm install . && cd $(TEST_SERVER) && npm install .
clean:
	git clean -xdf
	
default:
	grunt

.PHONY: default