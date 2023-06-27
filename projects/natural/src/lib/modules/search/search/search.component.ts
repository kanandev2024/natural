import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {deepClone} from '../classes/utils';
import {NaturalSearchFacets} from '../types/facet';
import {GroupSelections, NaturalSearchSelections} from '../types/values';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map} from 'rxjs';
import {MatDividerModule} from '@angular/material/divider';
import {NaturalIconDirective} from '../../icon/icon.directive';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {NaturalGroupComponent} from '../group/group.component';
import {NgClass, NgFor, NgIf, AsyncPipe} from '@angular/common';

@Component({
    selector: 'natural-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    standalone: true,
    imports: [
        NgClass,
        NgFor,
        NaturalGroupComponent,
        NgIf,
        MatButtonModule,
        MatTooltipModule,
        MatIconModule,
        NaturalIconDirective,
        MatDividerModule,
        AsyncPipe,
    ],
})
export class NaturalSearchComponent implements OnChanges {
    /**
     * Placeholder for last input (the free search input)
     */
    @Input() public placeholder = $localize`Rechercher`;

    /**
     * Exhaustive list of facets to be used in this <natural-search>
     */
    @Input() public facets: NaturalSearchFacets = [];

    /**
     * Whether to allow end-user to create multiple `OR` groups
     */
    @Input() public multipleGroups = false;

    /**
     * Text display in the dropdown to select the facet
     */
    @Input() public dropdownTitle = '';

    /**
     * Emits when some selection has been setted by the user
     */
    @Output() public readonly selectionChange = new EventEmitter<NaturalSearchSelections>();

    /**
     * Cleaned inputted selections. Allow valid selections to be manipulated inside component
     */
    public innerSelections: NaturalSearchSelections = [[]];

    /**
     * Input to display at component initialisation
     */
    @Input()
    public set selections(selections: NaturalSearchSelections) {
        this.innerSelections = selections && selections[0] ? deepClone(selections) : [[]];
    }

    public readonly isMobile = this.breakpointObserver.observe(Breakpoints.XSmall).pipe(map(result => result.matches));

    public constructor(private readonly breakpointObserver: BreakpointObserver) {}

    public ngOnChanges(): void {
        if (!this.facets) {
            this.facets = [];
        }
    }

    public updateGroup(groupSelections: GroupSelections, groupIndex: number): void {
        for (let i = 0; i < groupSelections.length; i++) {
            this.innerSelections[groupIndex][i] = groupSelections[i];
        }
        this.innerSelections[groupIndex].length = groupSelections.length;
        this.selectionChange.emit(this.innerSelections);
    }

    public addGroup(): void {
        this.innerSelections.push([]);
        this.selectionChange.emit(this.innerSelections);
    }

    public removeGroup(index: number): void {
        this.innerSelections.splice(index, 1);
        this.selectionChange.emit(this.innerSelections);
    }

    public clear(): void {
        this.innerSelections = [[]];
        this.selectionChange.emit([[]]);
    }
}
