# Advanced Search Component

## Introduction

The `AdvancedSearchComponent` allows for the creation of complex queries using a graphical widget.
The widget's contents are then turned into a string representing a Gravsearch (SPAQRL) query to be sent to DSP-API.

A query consists of the following elements:
- ontology (data model) selection
- selection of a resource class belonging to the selected ontology (optional)
- specification of properties, comparison operators, and values (optional).

A resource class has to be selected or at least one property has to be specified,
otherwise the query is not considered valid and cannot be submitted.

## Comparison Operators

Depending on the value type of the chosen property,
one or more of the following comparison operators can be selected:

- `is equal to`: value equality: same number, exact same string, overlap of date periods, same target resource.
- `is not equal to`: value inequality: not same number, not exact same string, no overlap of date periods, not same target resource.
- `is greater than`: value comparison: number is greater than search value, date period begins after search value.
- `is greater than or equal to` value equality / value comparison: number is equal or greater than search value, overlap of date periods or date period begins after search value.
- `is less than`: value comparison: number is less than search value, date period ends before search value.
- `is less than or equal to`: value equality / value comparison: number is equal or less than search value, overlap of date periods or date period ends before search value.
- `exists`: a value for the given property exists.
- `is like`: search value is contained in a text using the SPARQL [REGEX](https://www.w3.org/TR/sparql11-query/#func-regex) function (support of regular expressions).
- `matches`: text property: search value matches the text ([Lucene Query Parser Syntax](https://docs-api.dasch.swiss/08-lucene/lucene-query-parser-syntax/)), linking property: matches the specified linked resource.

## Search Examples

###



###
