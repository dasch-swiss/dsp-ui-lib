BIN = ./node_modules/.bin

# Read library path defined in angular.json
LIB_DIR := $(shell node -pe "require('$(CURRENT_DIR)/angular.json').projects['@dasch-swiss/dsp-ui'].root")

BRANCH := $(shell git rev-parse --abbrev-ref HEAD)

GIT_STATUS := $(shell git diff-index HEAD)
