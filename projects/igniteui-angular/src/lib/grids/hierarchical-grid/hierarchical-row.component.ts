import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    forwardRef,
    ElementRef,
    ViewChildren,
    QueryList,
    ViewChild,
    TemplateRef,
    Input,
    HostListener
} from '@angular/core';
import { IgxHierarchicalGridComponent } from './hierarchical-grid.component';
import { IgxRowDirective } from '../row.directive';
import { IgxHierarchicalGridCellComponent } from './hierarchical-cell.component';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    preserveWhitespaces: false,
    selector: 'igx-hierarchical-grid-row',
    templateUrl: './hierarchical-row.component.html',
    providers: [{ provide: IgxRowDirective, useExisting: forwardRef(() => IgxHierarchicalRowComponent) }]
})
export class IgxHierarchicalRowComponent extends IgxRowDirective<IgxHierarchicalGridComponent> {

    protected _ghostRow = false;
    protected expanderClass = 'igx-grid__hierarchical-expander';

    /**
    * @hidden
    */
    @Input()
        /**
     * @hidden
     */
    @HostBinding('class.igx-grid__tr--ghost-copy')
    public set ghostRow(value: boolean) {
        this.editable = !value;
        this._ghostRow = value;
    }

    public get ghostRow() {
        return this._ghostRow;
    }

    /**
    * @hidden
    */
    public get expanderClassResolved() {
        return {
            [this.expanderClass]: !this.pinned || this.ghostRow,
            [`${this.expanderClass}--empty`]: this.pinned && !this.ghostRow
        };
    }

    /**
     * The rendered cells in the row component.
     *
     * ```typescript
     * // get the cells of the third selected row
     * let selectedRowCells = this.grid.selectedRows[2].cells;
     * ```
     */
    @ViewChildren(forwardRef(() => IgxHierarchicalGridCellComponent), { read: IgxHierarchicalGridCellComponent })
    public cells: QueryList<IgxHierarchicalGridCellComponent>;

    @ViewChild('expander', { read: ElementRef })
    public expander: ElementRef<HTMLElement>;

    get viewIndex(): number {
        return this.index + this.grid.page * this.grid.perPage;
    }

    /**
    * @hidden
    */
   @ViewChild('defaultExpandedTemplate', { read: TemplateRef, static: true })
   protected defaultExpandedTemplate: TemplateRef<any>;

    /**
    * @hidden
    */
   @ViewChild('defaultEmptyTemplate', { read: TemplateRef, static: true })
   protected defaultEmptyTemplate: TemplateRef<any>;

    /**
    * @hidden
    */
   @ViewChild('defaultCollapsedTemplate', { read: TemplateRef, static: true })
   protected defaultCollapsedTemplate: TemplateRef<any>;

    /**
     * @hidden
     */
    @HostBinding('attr.tabindex')
    public tabindex = 0;

    /**
     * Returns whether the row is expanded.
     * ```typescript
     * const RowExpanded = this.grid1.rowList.first.expanded;
     * ```
     */
    public get expanded() {
        return this.gridAPI.get_row_expansion_state(this.rowData);
    }

    /**
     * @hidden
     */
    @HostBinding('class.igx-grid__tr--expanded')
    public get expandedClass() {
        return this.expanded && !this.pinned;
    }

    public get hasChildren() {
        return  !!this.grid.childLayoutKeys.length;
    }

    /**
     * @hidden
     */
    @HostBinding('class.igx-grid__tr--highlighted')
    public get highlighted() {
        return this.grid && this.grid.highlightedRowID === this.rowID;
    }

    /**
    * @hidden
    */
   public expanderClick(event) {
        event.stopPropagation();
        this.toggle();
    }

    /**
     * Toggles the hierarchical row.
     * ```typescript
     * this.grid1.rowList.first.toggle()
     * ```
     */
    public toggle() {
        if (this.added) {
            return;
        }
        const grid = this.gridAPI.grid;
        this.endEdit(grid.rootGrid);
        this.gridAPI.set_row_expansion_state(this.rowID, !this.expanded);
        grid.cdr.detectChanges();
    }

    /**
     * @hidden
     * @internal
     */
    public select = () => {
        this.grid.selectRows([this.rowID]);
    }

    /**
     * @hidden
     * @internal
     */
    public deselect = () => {
        this.grid.deselectRows([this.rowID]);
    }

    /**
    * @hidden
    */
    public getIconTemplate() {
        let expandable = true;
        if (this.grid.hasChildrenKey) {
            expandable = this.rowData[this.grid.hasChildrenKey];
        }
        if (!expandable || (this.pinned && !this.ghostRow)) {
            return this.defaultEmptyTemplate;
        }
        if (this.expanded) {
            return this.grid.rowExpandedIndicatorTemplate || this.defaultExpandedTemplate;
        } else {
            return this.grid.rowCollapsedIndicatorTemplate || this.defaultCollapsedTemplate;
        }
    }

    protected endEdit(grid: IgxHierarchicalGridComponent) {
        if (grid.crudService.inEditMode) {
            grid.endEdit();
        }
        grid.hgridAPI.getChildGrids(true).forEach(g => {
            if (g.crudService.inEditMode) {
            g.endEdit();
        }});
    }

    /**
     * @hidden
     * @internal
     */
    @HostListener('click', ['$event'])
    public onClick(event: MouseEvent) {
        if (this.ghostRow) { return; }
        super.onClick(event);
     }

    /**
     * @hidden
     */
    public onRowSelectorClick(event) {
        if (this.ghostRow) { return; }
        super.onRowSelectorClick(event);
     }
}
