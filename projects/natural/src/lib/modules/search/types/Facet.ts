import { Type } from '@angular/core';
import { DropdownComponent } from './DropdownComponent';
import { Selection } from './Values';

interface BasicFacet {
    /**
     * The label to be used in the GUI
     */
    display: string;

    /**
     * The field this facet should apply to.
     *
     * In most cases it should be the property name of the model. Something like:
     *
     * - name
     * - description
     * - artist.name
     */
    field: string;

    /**
     * Alias used as identifier for facet in case many facets use the same field name
     * Issue https://github.com/Ecodev/natural-search/issues/16
     */
    name?: string;

    /**
     * A function to transform the selection before it is applied onto the filter.
     *
     * This would typically be useful to do unit conversion so the GUI has some user
     * friendly values, but the API works with a "low-level" unit.
     */
    transform?: (Selection) => Selection;
}

/**
 * Facet that is only a flag (set or unset)
 */
export interface FlagFacet extends BasicFacet {

    /**
     * The value to be returned when the flag is set
     */
    condition: any;
}

/**
 * Facet that uses a component in a dropdown
 */
export interface DropdownFacet<C> extends BasicFacet {
    component: Type<DropdownComponent>;

    /**
     * Show a button into the dropdown container to validate value. Gives alternative to "click out" and incoming "tab/esc" key.
     */
    showValidateButton?: boolean;

    /**
     * Anything that could be useful for the dropdown component
     */
    configuration?: C;
}

/**
 * A facet
 */
export type Facet =
    DropdownFacet<any>
    | FlagFacet;

/**
 * Exhaustive list of facets
 */
export interface NaturalSearchFacets extends Array<Facet> {
}