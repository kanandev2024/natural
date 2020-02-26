// tslint:disable:directive-class-suffix
import { HostBinding, HostListener, Directive } from '@angular/core';
import { merge } from 'lodash';
import { NaturalAbstractController } from '../../classes/abstract-controller';
import { NaturalPanelsService } from './panels.service';
import { NaturalPanelData } from './types';

@Directive()
export class NaturalAbstractPanel extends NaturalAbstractController {

    /**
     * The data property is the container where the resolved content is stored
     * When loading a component from a panel opening (dialog), receives the data provided by the service
     */
    public data: any = {};

    /**
     * Bind isFrontPanel style class on root component
     */
    @HostBinding('class.isFrontPanel') public isFrontPanel = false;

    /**
     * Bind isPanel style class on root component
     */
    @HostBinding('class.isPanel') public isPanel = false;

    /**
     * Merging of data provided by the very root component (that is in a route context) and inherited data through panels
     * @TODO : provide type with available attributes
     */
    public panelData: NaturalPanelData;
    public panelService: NaturalPanelsService;

    /**
     * Bind click on panels, to allow the selection of those who are behind
     */
    @HostListener('click')
    public clickPanel() {
        if (!this.isFrontPanel && this.panelService) {
            this.panelService.goToPanelByComponent(this);
        }
    }

    /**
     * Called when panel opens and component is loaded
     * Runs before ngOnInit()
     */
    public initPanel(panelData: NaturalPanelData): void {
        this.panelData = panelData;
        this.isPanel = true;

        if (this.panelData && this.panelData.data) {
            merge(this.data, this.panelData.data);
        }
    }

}
