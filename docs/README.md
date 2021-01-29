# DSP-UI Documentation

This folder contains the sources to the DSP-UI documentation website. published
under [http://dasch-swiss.github.io/dsp-ui-lib](http://dasch-swiss.github.io/dsp-ui-lib).

This is the main documentation for all services the Data and Service Center for the Humanities DaSCH develops and supports. It includes

- [Knora](https://github.com/dasch-swiss/knora-api)
- [Sipi](https://github.com/dasch-swiss/Sipi)
- [DSP-JS lib](https://github.com/dasch-swiss/dsp-js-lib)
- [DSP-UI lib](https://github.com/dasch-swiss/dsp-ui-lib)
- [DSP-APP](https://github.com/dasch-swiss/dsp-app)

You'll find the documentaion on [docs.dasch.swiss](https://docs.dasch.swiss).

## Contribute

If you have to contribute and you want to add or edit entries, please read the following information about file structure and developing carefully.

### File structure

The documentation consists of two main topics with subordinate themes:

1. **how-to-use** contains all about the usage of the DSP-UI modules.
    - Getting Started = All about installation and init configuration
    - Action = Documentation for action module content
    - Core = Documentation for core module content
    - Search = Documentation for search module content
    - Viewer = Documentation for viewer module content
1. **how-to-contribute** contains all information for people who wants to contribute to DSP-UI-LIB
    - Contribution = How to contribute incl. link to the general DSP contribution guidelines (<https://docs.dasch.swiss/developers/dsp/contribution/>)
    - Design Documentation
    - Release Notes = Contains the CHANGELOG file of DSP-UI

Images like screenshots and so on has to be stored in `assets/images`.

## Developers

The documentation is based on [MkDocs](https://www.mkdocs.org).

To run the documentation locally you'll need [Python](https://www.python.org/) installed, as well as the Python package manager, [pip](http://pip.readthedocs.io/en/stable/installing/). You can check if you have these already installed from the command line:

```shell
$ python --version
Python 3.8.2
$ pip --version
pip 20.0.2 from /usr/local/lib/python3.8/site-packages/pip (python 3.8)
```

MkDocs supports Python versions 3.5, 3.6, 3.7, 3.8, and pypy3.

### Installing dependencies

Install the required packages by running

```shell
make install-requirements
```

### Getting started

MkDocs comes with a built-in dev-server that lets you preview your documentation as you work on it. Make sure you're in the same directory as the `mkdocs.yml` (repository's root folder) configuration file, and then start the server by running the following command:

```shell
$ make docs-serve
INFO    -  Building documentation...
INFO    -  Cleaning site directory
[I 160402 15:50:43 server:271] Serving on http://127.0.0.1:8000
[I 160402 15:50:43 handlers:58] Start watching changes
[I 160402 15:50:43 handlers:60] Start detecting changes
```

Open up <http://127.0.0.1:8000/> in your browser, and you'll see the documentation start page being.

In case you need to clean the project directory, run:

```shell
make docs-clean
```

To get some help about the `make` commands, run:

```shell
make help
```

### Building the documentation

To build the documentation just run

```shell
make docs-build
```

### Deploying github page

On each release of DSP-UI-LIB, a Github action script will build and deploy the documentation on [dasch-swiss.github.io/dsp-ui-lib](https://dasch-swiss.github.io/dsp-ui-lib). Behind the scenes, MkDocs builds the documentation and use the [mkdocs-deploy-gh-pages](https://github.com/marketplace/actions/deploy-mkdocs) actions script to deploy them to the gh-pages. That's it!
