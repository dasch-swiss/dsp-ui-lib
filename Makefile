# Determine this makefile's path.
# Be sure to place this BEFORE `include` directives, if any.
THIS_FILE := $(abspath $(lastword $(MAKEFILE_LIST)))

CURRENT_DIR := $(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
DIST_DIR := $(CURRENT_DIR)/dist/@dasch-swiss/dsp-ui/

ifeq ($(BUILD_TAG),)
	BUILD_TAG := $(shell git describe --tag --abbrev=0)
endif

.PHONY: clean

# Clones the knora-api git repository
.PHONY: clone-knora-stack
clone-knora-stack:
	@git clone --branch v13.0.0-rc.16 --single-branch --depth 1 https://github.com/dasch-swiss/knora-api.git $(CURRENT_DIR)/.tmp/knora-stack

.PHONY: knora-stack
knora-stack: ## runs the knora-stack
	$(MAKE) -C $(CURRENT_DIR)/.tmp/knora-stack init-db-test
	$(MAKE) -C $(CURRENT_DIR)/.tmp/knora-stack stack-up
	$(MAKE) -C $(CURRENT_DIR)/.tmp/knora-stack stack-logs-api-no-follow

.PHONY: display-tag-version
display-tag-version
	echo $(BUILD_TAG)

.PHONY: update-lib-version
update-lib-version: ## Get the latest tag from Github and update version in lib's package.json
	cd $(DIST_DIR) && \
	npm version $(BUILD_TAG) --git-tag-version=false --commit-hooks=false

.PHONY: prepare-lib
prepare-lib: ## Prepare lib for publishing: build and update version from git tag
	rm -rf $(DIST_DIR)
	npm install
	npm run build-lib
	@$(MAKE) -f $(THIS_FILE) update-lib-version

# .PHONY: publish-dry-run
# publish-dry-run: ## DRY RUN of publish process
# 	@$(MAKE) -f $(THIS_FILE) prepare-lib
# 	cd $(DIST_DIR) && npm publish --tag rc --access public --dry-run

# .PHONY: publish-rc-to-npm
# publish-rc-to-npm: ## BE CAREFUL!!! This will publish as release candidate to npm
# 	@$(MAKE) -f $(THIS_FILE) prepare-lib
# 	cd $(DIST_DIR) && npm publish --tag rc --access public

# .PHONY: publish-to-npm
# publish-to-npm: ## BE CAREFUL!!! This will publish new release to npm
# 	@$(MAKE) -f $(THIS_FILE) prepare-lib
# 	cd $(DIST_DIR) && npm publish --access public

.PHONY: help
help: ## this help
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST) | sort

.DEFAULT_GOAL := help
