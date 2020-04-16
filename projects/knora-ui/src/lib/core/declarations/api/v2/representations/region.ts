import { Constants, ReadGeomValue, ReadResource } from '@knora/api';

/**
 * Represents a region.
 * Contains a reference to the resource representing the region and its geometries.
 */

export class Region {

    /**
     *
     * @param regionResource a resource of type Region
     */
    constructor(readonly regionResource: ReadResource) {

    }

    /**
     * Get all geometry information belonging to this region.
     *
     * @returns ReadGeomValue[]
     */
    getGeometries() {
        return this.regionResource.properties[Constants.HasGeometry] as ReadGeomValue[];
    }
}
