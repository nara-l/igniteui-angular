import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DoCheck,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    OnInit,
    ViewChild
} from "@angular/core";
import { DataType } from "../data-operations/data-util";
import { SortingDirection } from "../data-operations/sorting-expression.interface";
import { RestrictDrag } from "../directives/dragdrop/dragdrop.directive";
import { IgxGridAPIService } from "./api.service";
import { IgxGridCellComponent } from "./cell.component";
import { IgxColumnComponent } from "./column.component";
import { autoWire, IGridBus } from "./grid.common";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    preserveWhitespaces: false,
    selector: "igx-grid-header",
    templateUrl: "./grid-header.component.html"
})
export class IgxGridHeaderComponent implements IGridBus, OnInit, DoCheck {

    @Input()
    public column: IgxColumnComponent;

    @Input()
    public gridID: string;

    @HostBinding("class")
    get styleClasses() {
        return `igx-grid__th ${this.column.headerClasses}`;
    }

    @HostBinding("style.min-width")
    @HostBinding("style.flex-basis")
    @HostBinding("class.igx-grid__th--fw")
    get width() {
        return this.column.width;
    }

    @HostBinding("class.asc")
    get ascending() {
        return this.sortDirection === SortingDirection.Asc;
    }

    @HostBinding("class.desc")
    get descending() {
        return this.sortDirection === SortingDirection.Desc;
    }

    @HostBinding("class.igx-grid__th--number")
    get columnType() {
        return this.column.dataType === DataType.Number;
    }

    @HostBinding("class.igx-grid__th--sorted")
    get sorted() {
        return this.sortDirection !== SortingDirection.None;
    }

    @HostBinding("attr.role")
    public hostRole = "columnheader";

    @HostBinding("attr.tabindex")
    public tabindex = 0;

    @HostBinding("attr.id")
    get headerID() {
        return `${this.gridID}_${this.column.field}`;
    }

    @ViewChild("resizeArea")
    public resizeArea: ElementRef;

    public resizeCursor = null;
    public showResizer = false;
    public resizerHeight;
    public dragDirection: RestrictDrag = RestrictDrag.HORIZONTALLY;
    public resizeEndTimeout = /Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent) ? 200 : 0;

    protected sortDirection = SortingDirection.None;
    private _startResizePos;
    private _pinnedMaxWidth;
    private _isResiznig = false;

    constructor(public gridAPI: IgxGridAPIService, public cdr: ChangeDetectorRef, public elementRef: ElementRef) { }

    public ngOnInit() {
        this.cdr.markForCheck();
    }

    public ngDoCheck() {
        this.getSortDirection();
    }

    @HostListener("click", ["$event"])
    @autoWire(true)
    public onClick(event) {
        if (!this._isResiznig) {
            event.stopPropagation();
            if (this.column.sortable) {
                const grid = this.gridAPI.get(this.gridID);

                this.sortDirection = ++this.sortDirection > SortingDirection.Desc ? SortingDirection.None
                    : this.sortDirection;
                this.gridAPI.sort(this.gridID, this.column.field, this.sortDirection, this.column.sortingIgnoreCase);
                grid.onSortingDone.emit({
                    dir: this.sortDirection,
                    fieldName: this.column.field,
                    ignoreCase: this.column.sortingIgnoreCase
                });
            }
        }
    }

    get restrictResizeMin(): number {
        return parseFloat(this.column.minWidth) - this.elementRef.nativeElement.getBoundingClientRect().width;
    }

    get restrictResizeMax(): number {
        const actualWidth = this.elementRef.nativeElement.getBoundingClientRect().width;

        if (this.column.pinned) {
            const pinnedMaxWidth = this._pinnedMaxWidth = this.grid.calcPinnedContainerMaxWidth - this.grid.pinnedWidth + actualWidth;

            if (this.column.maxWidth && parseFloat(this.column.maxWidth) < pinnedMaxWidth) {
                this._pinnedMaxWidth = this.column.maxWidth;

                return parseFloat(this.column.maxWidth) - actualWidth;
            } else {
                return pinnedMaxWidth - actualWidth;
            }
        } else {
            if (this.column.maxWidth) {
                return parseFloat(this.column.maxWidth) - actualWidth;
            } else {
                return Number.MAX_SAFE_INTEGER;
            }
        }
    }

    get grid(): any {
        return this.gridAPI.get(this.gridID);
    }

    @HostBinding("class.igx-grid__th--pinned")
    get isPinned() {
        return this.column.pinned;
    }

    @HostBinding("class.igx-grid__th--pinned-last")
    get isLastPinned() {
        const pinnedCols = this.grid.pinnedColumns;
        if (pinnedCols.length === 0) {
            return false;
        } else {
            return pinnedCols.indexOf(this.column) === pinnedCols.length - 1;
        }
    }

    protected getSortDirection() {
        const expr = this.gridAPI.get(this.gridID).sortingExpressions.find((x) => x.fieldName === this.column.field);
        this.sortDirection = expr ? expr.dir : SortingDirection.None;
    }

    public onResizeAreaMouseOver() {
        if (this.column.resizable) {
            this.resizeCursor = "col-resize";
        }
    }

    public onResizeAreaMouseDown(event) {
        if (event.button === 0 && this.column.resizable) {
            this.showResizer = true;
            this._isResiznig = true;
            this.resizerHeight = this.grid.calcResizerHeight;
            this._startResizePos = event.clientX;
        } else {
            this.resizeCursor = null;
        }
    }

    public onResizeAreaDblClick() {
        if (this.column.resizable) {
            const currentColWidth = this.elementRef.nativeElement.getBoundingClientRect().width;

            const range = this.column.grid.document.createRange();
            const valToPxls = (referenceNode) => {
                range.selectNodeContents(referenceNode);
                return  range.getBoundingClientRect().width;
            };

            const largest = new Map<number, number>();

            let cellsContentWidths = [];
            if (this.column.bodyTemplate && this.column.cells[0].nativeElement.children.length > 0) {
                this.column.cells.forEach((cell) => {
                    cellsContentWidths.push(Math.max(...Array.from(cell.nativeElement.children).map((child) => valToPxls(child))));
                });
            } else {
                cellsContentWidths = this.column.cells.map((cell) => valToPxls(cell.nativeElement));
            }

            const ind = cellsContentWidths.indexOf(Math.max(...cellsContentWidths));
            const cellStyle = this.grid.document.defaultView.getComputedStyle(this.column.cells[ind].nativeElement);
            let cellPadding = parseFloat(cellStyle.paddingLeft) + parseFloat(cellStyle.paddingRight);
            if (this.isLastPinned) {
                cellPadding += parseFloat(cellStyle.borderRightWidth);
            }
            largest.set(Math.max(...cellsContentWidths), cellPadding);

            const headerContentWidths = Array.from(this.elementRef.nativeElement.children)
                    .map((child) => valToPxls(child));
            const headerCell = Math.max(...headerContentWidths);
            const headerStyle = this.grid.document.defaultView.getComputedStyle(this.elementRef.nativeElement);
            const headerPadding = parseFloat(headerStyle.paddingLeft) + parseFloat(headerStyle.paddingRight) +
                    parseFloat(headerStyle.borderRightWidth);
            largest.set(headerCell, headerPadding);

            const largestCell = Math.max(...Array.from(largest.keys()));
            const largestCellPadding = largest.get(largestCell);
            const size = Math.ceil(largestCell + largestCellPadding) + "px";

            if (this.column.pinned) {
                const newPinnedWidth  = this.grid.pinnedWidth - currentColWidth + parseFloat(size);

                if (newPinnedWidth <= this.grid.calcPinnedContainerMaxWidth) {
                    this.column.width = size;
                }
            } else if (this.column.maxWidth && (parseFloat(size) > parseFloat(this.column.maxWidth))) {
                this.column.width = parseFloat(this.column.maxWidth) + "px";
            } else {
                this.column.width = size;
            }

            this.grid.markForCheck();
            this.grid.onColumnResized.emit({column: this.column, prevWidth: currentColWidth.toString(), newWidth: this.column.width});
        }
    }

    public onResize(event) {
        this._isResiznig = false;

        this.showResizer = false;
        const diff = event.clientX - this._startResizePos;

        if (this.column.resizable) {
            let currentColWidth = parseFloat(this.column.width);

            const colMinWidth = parseFloat(this.column.minWidth);
            const colMaxWidth = this.column.pinned ? parseFloat(this._pinnedMaxWidth) : parseFloat(this.column.maxWidth);
            const actualWidth = this.elementRef.nativeElement.getBoundingClientRect().width;

            currentColWidth = (currentColWidth < actualWidth) ? actualWidth : currentColWidth;

            if (currentColWidth + diff < colMinWidth) {
                this.column.width = colMinWidth + "px";
            } else if (colMaxWidth && (currentColWidth + diff > colMaxWidth)) {
                this.column.width = colMaxWidth + "px";
            } else {
                this.column.width = (currentColWidth + diff) + "px";
            }

            this.grid.markForCheck();

            if (currentColWidth !== parseFloat(this.column.width)) {
                this.grid.onColumnResized.emit({column: this.column, prevWidth: currentColWidth.toString(), newWidth: this.column.width});
            }
        }
    }
}
