import {
    Component,
    ViewChild,
    OnDestroy,
    HostBinding,
    ChangeDetectorRef
} from '@angular/core';
import { IgxButtonGroupComponent } from '../../../buttonGroup/buttonGroup.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IgxGridExcelStyleFilteringComponent } from './grid.excel-style-filtering.component';

/**
 * A component used for presenting Excel style column sorting UI.
 */
@Component({
    preserveWhitespaces: false,
    selector: 'igx-excel-style-sorting',
    templateUrl: './excel-style-sorting.component.html'
})
export class IgxExcelStyleSortingComponent implements OnDestroy {
    private destroy$ = new Subject<boolean>();

    /**
     * @hidden @internal
     */
    @HostBinding('class') class = 'igx-excel-filter__sort';

    /**
     * @hidden @internal
     */
    @ViewChild('sortButtonGroup', { read: IgxButtonGroupComponent })
    public sortButtonGroup: IgxButtonGroupComponent;

    constructor(public esf: IgxGridExcelStyleFilteringComponent, private cdr: ChangeDetectorRef) {
        this.esf.sortingChanged.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.updateSelectedButtons(this.esf.column.field);
        });
     }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    private updateSelectedButtons(fieldName: string) {
        const sortIndex = this.esf.grid.sortingExpressions.findIndex(s => s.fieldName === fieldName);

        this.cdr.detectChanges();
        this.sortButtonGroup.buttons.forEach((b, i) => {
            this.sortButtonGroup.deselectButton(i);
        });

        if (sortIndex !== -1 ) {
            const sortDirection = this.esf.grid.sortingExpressions[sortIndex].dir;
            this.sortButtonGroup.selectButton(sortDirection - 1);
        }
    }

    /**
     * @hidden @internal
     */
    public onSortButtonClicked(sortDirection) {
        if (this.sortButtonGroup.selectedIndexes.length === 0) {
            if (this.esf.grid.isColumnGrouped(this.esf.column.field)) {
                this.sortButtonGroup.selectButton(sortDirection - 1);
            } else {
                this.esf.grid.clearSort(this.esf.column.field);
            }
        } else {
            this.esf.grid.sort({ fieldName: this.esf.column.field, dir: sortDirection, ignoreCase: true });
        }
    }
}
