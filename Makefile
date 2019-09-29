PRETTIER := ./node_modules/.bin/prettier
BUILD_LIST := ./buildList.js

.PHONY: all
all: expire tld.js prettier

# Remove old tld.js
.PHONY: expire
expire:
	find . -maxdepth 1 -type f -name tld.js -mtime +1 -exec rm -f {} \;

# Download TLD list and build tld.js
tld.js:
	$(BUILD_LIST)

# Tidy up source
.PHONY: prettier
prettier:
	$(PRETTIER) --write **/*.js **/*.json

.PHONY: clean
clean:
	rm -f tld.js
