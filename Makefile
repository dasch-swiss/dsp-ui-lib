BIN = ./node_modules/.bin
# Determine this makefile's path.
# Be sure to place this BEFORE `include` directives, if any.
THIS_FILE := $(lastword $(MAKEFILE_LIST))
CURRENT_DIR := $(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
LIB_DIR := $(shell node -pe "require('$(CURRENT_DIR)/angular.json').projects['@dasch-swiss/dsp-ui'].root")

define update-version
	# update version: first as dry-run.
	# The user has to confirm the update.
	# If everything is fine, it will commit and push the updated packages
	CURRENT_VERSION=`node -pe "require('./package.json').version"` && \
	npm version $(1) --preid=$(2) --git-tag-version=false --commit-hooks=false && \
	NEXT_VERSION=`node -pe "require('./package.json').version"` && \
	echo "This will update from $$CURRENT_VERSION to $$NEXT_VERSION ($(1)). Do you want to continue? [Y/n]" && \
	read ans && \
	([ $${ans:-N} != Y ] && npm version $$CURRENT_VERSION --git-tag-version=false --commit-hooks=false && exit 1) || \
	([ $${ans:-N} == Y ]) && \
	cd $(LIB_DIR) && \
	npm version "$$NEXT_VERSION" && \
	cd $(CURRENT_DIR) && \
	git add package.json && \
	git add package-lock.json && \
	git add $(LIB_DIR)/package.json && \
	git commit -m "release($(1)): $$NEXT_VERSION" && \
	git push
endef

.PHONY: clean

.PHONY: next-release-candidate
next-release-candidate: ## updates version to next release candidate e.g. from 3.0.0-rc.0 to 3.0.0-rc.1 or from 3.0.0 to 3.0.1-rc.0
	@$(call update-version,prerelease,rc)

.PHONY: release-patch
release-patch: ## updates version to next PATCH version e.g. from 3.0.0 to 3.0.1
	@$(call update-version,patch)

.PHONY: prerelease-patch
prerelease-patch: ## updates version to next PATCH as release-candidate e.g. from 3.0.1 to 3.0.2-rc.0
	@$(call update-version,prepatch,rc)

.PHONY: release-minor
release-minor: ## updates version to next MINOR version e.g. from 3.0.0 to 3.1.0
	@$(call update-version,minor)

.PHONY: prerelease-minor
prerelease-minor: ## updates version to next MINOR as release-candidate e.g. from 3.1.0 to 3.2.0-rc.0
	@$(call update-version,preminor,rc)

.PHONY: release-major
release-major: ## updates version to next MAJOR version e.g. from 3.0.0 to 4.0.0
	@$(call update-version,major)

.PHONY: prerelease-major
prerelease-major: ## updates version to next MAJOR as release candidate e.g. from 4.0.0 to 5.0.0-rc.0
	@$(call update-version,premajor,rc)

# Clones the knora-api git repository
.PHONY: clone-knora-stack
clone-knora-stack:
	@git clone --branch v13.0.0-rc.8 --single-branch --depth 1 https://github.com/dasch-swiss/knora-api.git $(CURRENT_DIR)/.tmp/knora-stack

.PHONY: knora-stack
knora-stack: ## runs the knora-stack
	sudo apt-get install expect
	$(MAKE) -C $(CURRENT_DIR)/.tmp/knora-stack stack-without-api
	$(MAKE) -C $(CURRENT_DIR)/.tmp/knora-stack print-env-file
	$(MAKE) -C $(CURRENT_DIR)/.tmp/knora-stack stack-config
	sleep 15
	$(MAKE) -C $(CURRENT_DIR)/.tmp/knora-stack init-db-test
	sleep 15
	$(MAKE) -C $(CURRENT_DIR)/.tmp/knora-stack stack-restart-api
	sleep 35
	$(MAKE) -C $(CURRENT_DIR)/.tmp/knora-stack stack-logs-api-no-follow

.PHONY: help
help: ## this help
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST) | sort

.DEFAULT_GOAL := help
