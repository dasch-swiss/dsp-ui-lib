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

- `is equal to`: value equality (same number, exact same string, overlap of date periods)
- `is not equal to`: value inequality (not same number, not exact same string, no overlap of date periods)
- `is greater than`:
- `is greater than or equal to`
- `is less than`
- `is less than or equal to`
- `exists`
- `is like`
- `matches`


## Search Examples

###



###
