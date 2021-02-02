BIN = ./node_modules/.bin
# Determine this makefile's path.
# Be sure to place this BEFORE `include` directives, if any.
THIS_FILE := $(abspath $(lastword $(MAKEFILE_LIST)))
CURRENT_DIR := $(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))

include vars.mk

.PHONY: clean

#################################
# Documentation targets
#################################

.PHONY: docs-publish
docs-publish: ## build and publish docs to github Pages
	mkdocs gh-deploy

.PHONY: docs-build
docs-build: ## build docs into the local 'site' folder
	mkdocs build

.PHONY: docs-serve
docs-serve: ## serve docs for local viewing
	mkdocs serve

.PHONY: docs-install-requirements
docs-install-requirements: ## install requirements
	pip3 install -r docs/requirements.txt

.PHONY: docs-clean
docs-clean: ## cleans the project directory
	@rm -rf site/

#################################
# Knora stack (DSP-API) targets
#################################

.PHONY: clone-knora-stack
clone-knora-stack: # Clones the knora-api git repository
	@rm -rf $(CURRENT_DIR)/.tmp/knora-stack
	@git clone --branch $(API_VERSION) --single-branch --depth 1 https://github.com/dasch-swiss/dsp-api.git $(CURRENT_DIR)/.tmp/knora-stack

.PHONY: knora-stack
knora-stack: clone-knora-stack ## runs the knora-stack
	$(MAKE) -C $(CURRENT_DIR)/.tmp/knora-stack init-db-test
	$(MAKE) -C $(CURRENT_DIR)/.tmp/knora-stack stack-up
	$(MAKE) -C $(CURRENT_DIR)/.tmp/knora-stack stack-logs-api-no-follow

.PHONY: help
help: ## this help
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST) | sort

.DEFAULT_GOAL := help
