import { AsyncFactoryFn, ComponentHarness } from '@angular/cdk/testing';
import { MatSelectHarness } from '@angular/material/select/testing';

export class SelectOntologyHarness extends ComponentHarness {
    static hostSelector = 'dsp-select-ontology';

    protected getOntoSelection: AsyncFactoryFn<MatSelectHarness> =
        this.locatorFor(MatSelectHarness);

    protected async getOntologySelection(): Promise<MatSelectHarness> {
        return await this.getOntoSelection();
    }

    async getOntologyOptions(): Promise<string[]> {
        const ontoSelection = await this.getOntologySelection();

        await ontoSelection.open();
        const options = await ontoSelection.getOptions();
        const optionTexts = options.map(option => option.getText());

        return Promise.all(optionTexts);
    }

    async chooseOntology(ontologyText: string): Promise<void> {
        const ontoSelection = await this.getOntologySelection();

        return ontoSelection.clickOptions({ text: ontologyText});
    }

}
