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

The documentation consists of three main topics with subordinate themes:

1. **User-Guide** contains all about the usage of the generic web application.
    - Introduction / index = Web app overview
    - Project management = Admin interface, where a project or system admin can define a project, build a team and user groups permissions but also define the data model (ontology and list editor).
    - Data management = Research tools are part of the workspace where a user can look for sources, open and work on them: edit metadata, annotate and expand data by using e.g. a transcription tool.
    - User management = All information related to the user account, e.g. user profile, user's projects and collections, update password.
    - System management = System admin interface where a system admin can manage all projects and all users.
    - Publication = Manifest++ will be the data presentation part where a user can configure a project specific webpage.
1. **Developers** contains all information for people who wants to use Knora or to help improving one of the software mentioned above.
    - Documentation = Information about the tools and usage
    - Installation / Setup = Guide with the usual content about "getting started"
    - API reference = all about Knora-API incl. Sipi IIIF routes
    - Contribution = Design documentation to help people who want to write
1. **Community** almost links to other services and support pages
      - Discuss Forum = Link to [discuss.dasch.swiss](https://discuss.dasch.swiss)
      - FAQ = List of questions and answers
      - Product Updates = List of release notes
      - About us = all about DaSCH and DaSCH developers

Images like screenshots and so on has to be stored in `assets/images`.

## Developers

The documentation is based on [MkDocs](https://www.mkdocs.org).

To run the documentation locally you'll need [Python](https://www.python.org/) installed, as well as the Python package manager, [pip](http://pip.readthedocs.io/en/stable/installing/). You can check if you have these already installed from the command line:

```shell
$ python --version
Python 2.7.2
$ pip --version
pip 1.5.2
```

MkDocs supports Python versions 2.7, 3.4, 3.5, 3.6, 3.7 and [pypy](https://pypy.org).

### Installing dependencies

Install the required packages by running

```shell
make install-requirements
```

### Getting started

MkDocs comes with a built-in dev-server that lets you preview your documentation as you work on it. Make sure you're in the same directory as the mkdocs.yml configuration file, and then start the server by running the following command:

```shell
$ make serve-docs
INFO    -  Building documentation...
INFO    -  Cleaning site directory
[I 160402 15:50:43 server:271] Serving on http://127.0.0.1:8000
[I 160402 15:50:43 handlers:58] Start watching changes
[I 160402 15:50:43 handlers:60] Start detecting changes
```

Open up http://127.0.0.1:8000/ in your browser, and you'll see the documentation start page being.

In case you need to clean the project directory, run:

```shell
make clean
```

To get some help about the `make` commands, run:

```shell
make help
```

### Building the documentation

To build the documentation just run

```shell
make build-docs
```

### Deploying github page

On each push into `main` branch, a Github action script will build and deploy the documentation on [docs.dasch.swiss](https://docs.dasch.swiss). Behind the scenes, MkDocs builds the documentation and use the [ghp-import](https://github.com/davisp/ghp-import) tool to commit them to the gh-pages branch and then push the gh-pages branch to GitHub. That's it!
