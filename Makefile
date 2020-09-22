BIN = ./node_modules/.bin
# Determine this makefile's path.
# Be sure to place this BEFORE `include` directives, if any.
THIS_FILE := $(lastword $(MAKEFILE_LIST))
CURRENT_DIR := $(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))

.PHONY: clean

# Clones the knora-api git repository
.PHONY: clone-knora-stack
clone-knora-stack:
	@git clone --branch v13.0.0-rc.15 --single-branch --depth 1 https://github.com/dasch-swiss/knora-api.git $(CURRENT_DIR)/.tmp/knora-stack

.PHONY: knora-stack
knora-stack: ## runs the knora-stack
	$(MAKE) -C $(CURRENT_DIR)/.tmp/knora-stack init-db-test
	$(MAKE) -C $(CURRENT_DIR)/.tmp/knora-stack stack-up
	$(MAKE) -C $(CURRENT_DIR)/.tmp/knora-stack stack-logs-api-no-follow

.PHONY: help
help: ## this help
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST) | sort

.DEFAULT_GOAL := help
