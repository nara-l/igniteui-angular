import { Component, ViewChild, ElementRef, ChangeDetectorRef, OnInit } from '@angular/core';
import {
    IgxDropDownComponent,
    OverlaySettings,
    IgxDragDirective,
    IgxOverlayService
} from 'igniteui-angular';
import { RelativePositionStrategy, AbsolutePosition, RelativePosition } from 'projects/igniteui-angular/src/lib/services/overlay/utilities';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'overlay-presets-sample',
    templateUrl: './overlay-presets.sample.html',
    styleUrls: ['overlay-presets.sample.scss']
})
export class OverlayPresetsSampleComponent implements OnInit {
    @ViewChild(IgxDropDownComponent, { static: true }) public igxDropDown: IgxDropDownComponent;
    @ViewChild('button', { static: true }) public button: ElementRef;
    @ViewChild('outlet', { static: true }) public outletElement: ElementRef;
    @ViewChild(IgxDragDirective, { static: true }) public igxDrag: IgxDragDirective;

    private _overlaySettings: OverlaySettings;
    private xAddition = 0;
    private yAddition = 0;
    items = [];
    itemsCount = 10;
    relStrategies = [RelativePositionStrategy.Auto, RelativePositionStrategy.Connected, RelativePositionStrategy.Elastic];
    absStrategies = ['Global', 'Container'];
    positionStrategy = 'Global';
    absPosition: AbsolutePosition = AbsolutePosition.Center;
    absPositions = [AbsolutePosition.Center, AbsolutePosition.Top, AbsolutePosition.Bottom];
    relPosition: RelativePosition;
    relPositions = [
        RelativePosition.Above,
        RelativePosition.Below,
        RelativePosition.Before,
        RelativePosition.After,
        RelativePosition.Default];

    constructor(
    ) {
        for (let item = 0; item < this.itemsCount; item++) {
            this.items.push(`Item ${item}`);
        }
    }

    ngOnInit(): void {
        this._overlaySettings = IgxOverlayService.createAbsoluteOverlaySettings(this.absPosition);
    }

    onChange() {
        switch (this.positionStrategy) {
            case RelativePositionStrategy.Auto:
            case RelativePositionStrategy.Connected:
            case RelativePositionStrategy.Elastic:
                this.absPosition = null;
                this.relPosition = this.relPosition || RelativePosition.Default;
                this._overlaySettings = IgxOverlayService.createRelativeOverlaySettings(
                    this.button.nativeElement,
                    this.relPosition,
                    this.positionStrategy);
                break;
            case 'Global':
                this.relPosition = null;
                this._overlaySettings = IgxOverlayService.createAbsoluteOverlaySettings(this.absPosition);
                break;
            case 'Container':
                this.relPosition = null;
                this._overlaySettings = IgxOverlayService.createAbsoluteOverlaySettings(this.absPosition, this.outletElement);
                break;
            default:
                this.relPosition = null;
                this._overlaySettings = IgxOverlayService.createAbsoluteOverlaySettings();
        }
    }

    public toggleDropDown() {
        this.igxDropDown.toggle(this._overlaySettings);
    }

    public onDragEnd(e) {
        const originalEvent: PointerEvent = e.originalEvent;
        const wrapperElement = document.getElementsByClassName('sample-wrapper')[0];
        const wrapperElementRect = wrapperElement.getBoundingClientRect();
        const left = originalEvent.clientX - wrapperElementRect.left - this.xAddition;
        const top = originalEvent.clientY - wrapperElementRect.top - this.yAddition;
        this.igxDrag.element.nativeElement.style.left = `${Math.max(0, left)}px`;
        this.igxDrag.element.nativeElement.style.top = `${Math.max(0, top)}px`;
    }

    public onDragStart(e) {
        const originalEvent: PointerEvent = e.originalEvent;
        const buttonRect = (<any>originalEvent.target).getBoundingClientRect();
        this.xAddition = originalEvent.clientX - buttonRect.left;
        this.yAddition = originalEvent.clientY - buttonRect.top;
    }
}
