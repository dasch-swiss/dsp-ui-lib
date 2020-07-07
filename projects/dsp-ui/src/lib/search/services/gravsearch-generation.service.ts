/**
 *
 * Create Gravsearch queries from provided parameters.
 */
import { Injectable } from '@angular/core';
import { Constants } from '@dasch-swiss/dsp-js';
import { ExtendedSearchParams, ExtendedSearchParamsService } from './extended-search-params.service';
import { PropertyWithValue } from '../advanced-search/select-property/specify-property-value/operator';
import { ComparisonOperatorConstants } from '../advanced-search/select-property/specify-property-value/operator-constants';

@Injectable({
    providedIn: 'root'
})
export class GravsearchGenerationService {

    static complexTypeToProp = {
        [Constants.IntValue]: Constants.IntValueAsInt,
        [Constants.DecimalValue]: Constants.DecimalValueAsDecimal,
        [Constants.BooleanValue]: Constants.BooleanValueAsBoolean,
        [Constants.TextValue]: Constants.ValueAsString,
        [Constants.UriValue]: Constants.UriValueAsUri,
        [Constants.ListValue]: Constants.ListValueAsListNode
    };

    constructor(private _searchParamsService: ExtendedSearchParamsService) { }

    /**
     *
     * Will be replaced by `@knora/api` (github:knora-api-js-lib)
     *
     * Generates a Gravsearch query from the provided arguments.
     *
     * @param properties the properties specified by the user.
     * @param mainResourceClassOption the class of the main resource, if any.
     * @param offset the offset to be used (nth page of results).
     */
    createGravsearchQuery(properties: PropertyWithValue[], mainResourceClassOption?: string, offset: number = 0): string {

        // class restriction for the resource searched for
        let mainResourceClass = '';

        // if given, create the class restriction for the main resource
        if (mainResourceClassOption !== undefined) {
            mainResourceClass = `?mainRes a <${mainResourceClassOption}> .`;
        }

        // criteria for the order by statement
        const orderByCriteria = [];

        // statements to be returned in query results
        const returnStatements = [];

        // loop over given properties and create statements and filters from them
        const props: string[] = properties.map(
            (propWithVal: PropertyWithValue, index: number) => {

                // represents the object of a statement
                let propValue;
                if (!propWithVal.property.isLinkProperty || propWithVal.valueLiteral.comparisonOperator.getClassName() === 'Exists') {
                    // it is not a linking property, create a variable for the value (to be used by a subsequent FILTER)
                    // OR the comparison operator Exists is used in which case we do not need to specify the object any further
                    propValue = `?propVal${index}`;
                } else {
                    // it is a linking property and the comparison operator is not Exists, use its IRI
                    propValue = propWithVal.valueLiteral.value.toSparql();
                }

                // generate statement
                let statement = `?mainRes <${propWithVal.property.id}> ${propValue} .`;

                // check if it is a linking property that has to be wrapped in a FILTER NOT EXISTS (comparison operator NOT_EQUALS) to negate it
                if (propWithVal.property.isLinkProperty && propWithVal.valueLiteral.comparisonOperator.getClassName() === 'NotEquals') {
                    // do not include statement in results, because the query checks for the absence of this statement
                    statement = `FILTER NOT EXISTS {
${statement}


}`;
                } else {
                    // TODO: check if statement should be returned returned in results (Boolean flag from checkbox)
                    returnStatements.push(statement);
                    statement = `
${statement}


`;
                }

                // generate restricting expression (e.g., a FILTER) if comparison operator is not Exists
                let restriction = '';
                // only create a FILTER if the comparison operator is not EXISTS and it is not a linking property
                if (!propWithVal.property.isLinkProperty && propWithVal.valueLiteral.comparisonOperator.getClassName() !== 'Exists') {
                    // generate variable for value literal
                    const propValueLiteral = `${propValue}Literal`;

                    if (propWithVal.valueLiteral.comparisonOperator.getClassName() === 'Like') {
                        // generate statement to value literal
                        restriction = `${propValue} <${GravsearchGenerationService.complexTypeToProp[propWithVal.property.objectType]}> ${propValueLiteral}` + '\n';
                        // use regex function for LIKE
                        restriction += `FILTER regex(${propValueLiteral}, ${propWithVal.valueLiteral.value.toSparql()}, "i")`;
                    } else if (propWithVal.valueLiteral.comparisonOperator.getClassName() === 'Match') {
                        // use Gravsearch function for MATCH
                        restriction += `FILTER <${ComparisonOperatorConstants.MatchFunction}>(${propValue}, ${propWithVal.valueLiteral.value.toSparql()})`;
                    } else if (propWithVal.property.objectType === Constants.DateValue) {
                        // handle date property
                        restriction = `FILTER(knora-api:toSimpleDate(${propValue}) ${propWithVal.valueLiteral.comparisonOperator.type} ${propWithVal.valueLiteral.value.toSparql()})`;
                    } else if (propWithVal.property.objectType === Constants.ListValue) {
                        // handle list node
                        restriction = `${propValue} <${GravsearchGenerationService.complexTypeToProp[propWithVal.property.objectType]}> ${propWithVal.valueLiteral.value.toSparql()}` + '\n';
                        // check for comparison operator "not equals"
                        if (propWithVal.valueLiteral.comparisonOperator.getClassName() === 'NotEquals') {
                            restriction = `FILTER NOT EXISTS {
                                ${restriction}
                            }`;
                        }
                    } else {
                        // generate statement to value literal
                        restriction = `${propValue} <${GravsearchGenerationService.complexTypeToProp[propWithVal.property.objectType]}> ${propValueLiteral}` + '\n';
                        // generate filter expression
                        restriction += `FILTER(${propValueLiteral} ${propWithVal.valueLiteral.comparisonOperator.type} ${propWithVal.valueLiteral.value.toSparql()})`;
                    }
                }

                // check if current value is a sort criterion
                if (propWithVal.isSortCriterion) {
                    orderByCriteria.push(propValue);
                }

                return `${statement}
${restriction}
`;

            });

        let orderByStatement = '';

        if (orderByCriteria.length > 0) {
            orderByStatement = `
ORDER BY ${orderByCriteria.join(' ')}
`;
        }

        // template of the Gravsearch query with dynamic components
        const gravsearchTemplate = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
CONSTRUCT {

?mainRes knora-api:isMainResource true .

${returnStatements.join('\n')}

} WHERE {

?mainRes a knora-api:Resource .

${mainResourceClass}

${props.join('')}

}
${orderByStatement}`;

        // offset component of the Gravsearch query
        const offsetTemplate = `
OFFSET ${offset}
`;

        // function that generates the same Gravsearch query with the given offset
        const generateGravsearchQueryWithCustomOffset = (localOffset: number): string => {
            const offsetCustomTemplate = `
OFFSET ${localOffset}
`;

            return gravsearchTemplate + offsetCustomTemplate;
        };

        if (offset === 0) {
            // store the function so another Gravsearch query can be created with an increased offset
            this._searchParamsService.changeSearchParamsMsg(new ExtendedSearchParams(generateGravsearchQueryWithCustomOffset));
        }


        return gravsearchTemplate + offsetTemplate;

    }

}

