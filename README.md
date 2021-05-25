# DSP-UI &mdash; A library to easily create DSP Apps

[![npm version](https://badge.fury.io/js/%40dasch-swiss%2Fdsp-ui.svg)](https://www.npmjs.com/package/@dasch-swiss/dsp-ui)
[![CI](https://github.com/dasch-swiss/dsp-ui-lib/workflows/CI/badge.svg)](https://github.com/dasch-swiss/dsp-ui-lib/actions?query=workflow%3ACI)
[![npm downloads](https://img.shields.io/npm/dt/@dasch-swiss/dsp-ui.svg?style=flat)](https://www.npmjs.com/package/@dasch-swiss/dsp-ui)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/@dasch-swiss/dsp-ui.svg?style=flat)](https://www.npmjs.com/package/@dasch-swiss/dsp-ui)
[![license](https://img.shields.io/npm/l/@dasch-swiss/dsp-ui.svg?style=flat)](https://github.com/dasch-swiss/dsp-ui-lib/blob/main/LICENSE)

<!-- This is the demo and developing environment for the [DSP-UI library (@dasch-swiss/dsp-ui)](https://www.npmjs.com/package/@dasch-swiss/dsp-ui). -->

DSP-UI is a library of angular modules enabling users to interact with [DSP-API](https://docs.dasch.swiss/developers/knora/api-reference/) to create a web application in a quick and simple way. These modules, comprised of components and directives, are written in Typescript and rely on [Angular material](https://material.angular.io).

DSP-UI is developed by the [Data and Service Center for the Humanities](https://dasch.swiss) as [free software](http://www.gnu.org/philosophy/free-sw.en.html),
released under [GNU Affero General Public](http://www.gnu.org/licenses/agpl-3.0.en.html) license.

## Documentation

### ➡ [Getting started](https://dasch-swiss.github.io/dsp-ui-lib/how-to-use/getting-started/)

### Library modules

The library consists of four Angular modules that are briefly described below.

### ➡ [DspCoreModule](https://dasch-swiss.github.io/dsp-ui-lib/how-to-use/core/)

*Services for API requests*
> DspCoreModule is a configuration handler for [`@dasch-swiss/dsp-js`](https://www.npmjs.com/package/@dasch-swiss/dsp-js) which offers all the services to make [DSP-API requests](https://docs.dasch.swiss/developers/knora/api-reference/queries/).

### ➡ [DspViewerModule](https://dasch-swiss.github.io/dsp-ui-lib/how-to-use/viewer/)

*Resources, Properties, Lists, Value components*
> DspViewerModule contains object components to show a resource class representation, the property gui-elements and various view frameworks.

### ➡ [DspSearchModule](https://dasch-swiss.github.io/dsp-ui-lib/how-to-use/search/)

*Search panel for all kind of search queries*
> DspSearchModule allows to make full text or advanced searches in DSP-API. Filter by resource class and its properties related to an ontology.

### ➡ [DspActionModule](https://dasch-swiss.github.io/dsp-ui-lib/how-to-use/action/)

*Special pipes and buttons*
> DspActionModule contains special pipes to sort lists or to get the index key in arrays, but also directives and components for images, sort buttons and s.o.

## Contribution

If you would like to contribute to the development of the DSP-UI modules alongside us, please consult the  [general DSP contribution guidelines](https://docs.dasch.swiss/developers/dsp/contribution/) or the [DSP-UI specific contribution guidelines](https://dasch-swiss.github.io/dsp-ui-lib/how-to-contribute/) and the [design documentation](https://dasch-swiss.github.io/dsp-ui-lib/how-to-contribute/design-documentation/).
