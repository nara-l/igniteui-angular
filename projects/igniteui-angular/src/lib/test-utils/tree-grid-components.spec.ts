import { Component, ViewChild } from '@angular/core';
import { IgxTreeGridComponent } from '../grids/tree-grid/tree-grid.component';
import { SampleTestData } from './sample-test-data.spec';
import { IgxNumberSummaryOperand, IgxSummaryResult } from '../grids';
import { IgxGridTransaction } from '../grids/grid-base.component';
import { IgxTransactionService } from '../services/transaction/igx-transaction';
import { IgxHierarchicalTransactionService } from '../services/transaction/igx-hierarchical-transaction';
import { DisplayDensity } from '../core/displayDensity';

@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" childDataKey="Employees" width="900px" height="600px">
        <igx-column [field]="'ID'" dataType="number" [sortable]="true"></igx-column>
        <igx-column [field]="'Name'" dataType="string" [sortable]="true"></igx-column>
        <igx-column [field]="'HireDate'" dataType="date" [sortable]="true"></igx-column>
        <igx-column [field]="'Age'" dataType="number" [sortable]="true"></igx-column>
    </igx-tree-grid>
    `
})
export class IgxTreeGridSortingComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeSmallTreeData();
}

@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" childDataKey="Employees" expansionDepth="2" width="900px" height="800px">
        <igx-column [field]="'ID'" dataType="number" [filterable]="true"></igx-column>
        <igx-column [field]="'Name'" dataType="string" [filterable]="true"></igx-column>
        <igx-column [field]="'HireDate'" dataType="date" [filterable]="true"></igx-column>
        <igx-column [field]="'Age'" dataType="number" [filterable]="true"></igx-column>
    </igx-tree-grid>
    `
})
export class IgxTreeGridFilteringComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeTreeData();
}

@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" childDataKey="Employees" primaryKey="ID" width="900px" height="600px">
        <igx-column [field]="'ID'" dataType="number"></igx-column>
        <igx-column [field]="'Name'" dataType="string"></igx-column>
        <igx-column [field]="'HireDate'" dataType="date"></igx-column>
        <igx-column [field]="'Age'" dataType="number"></igx-column>
    </igx-tree-grid>
    `
})
export class IgxTreeGridSimpleComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeSmallTreeData();
}

@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" childDataKey="Employees" primaryKey="ID" width="318px" height="400px" columnWidth="100px">
        <igx-column [field]="'ID'" dataType="number"></igx-column>
        <igx-column [field]="'Name'" dataType="string"></igx-column>
        <igx-column [field]="'HireDate'" dataType="date"></igx-column>
        <igx-column [field]="'Age'" dataType="number"></igx-column>
        <igx-column [field]="'OnPTO'" dataType="boolean"></igx-column>
    </igx-tree-grid>
    `
})
export class IgxTreeGridWithScrollsComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeAllTypesTreeData();
}

@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" childDataKey="Employees" primaryKey="ID" width="600px" height="600px" columnWidth="100px">
        <igx-column [field]="'ID'" dataType="number"></igx-column>
        <igx-column [field]="'Name'" dataType="string"></igx-column>
        <igx-column [field]="'HireDate'" dataType="date"></igx-column>
        <igx-column [field]="'Age'" dataType="number"></igx-column>
        <igx-column [field]="'OnPTO'" dataType="boolean"></igx-column>
    </igx-tree-grid>
    `
})
export class IgxTreeGridWithNoScrollsComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeAllTypesTreeData();
}

@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" primaryKey="ID" foreignKey="ParentID" width="900px" height="600px">
        <igx-column [field]="'ID'" dataType="number"></igx-column>
        <igx-column [field]="'ParentID'" dataType="number"></igx-column>
        <igx-column [field]="'Name'" dataType="string"></igx-column>
        <igx-column [field]="'JobTitle'" dataType="string"></igx-column>
        <igx-column [field]="'Age'" dataType="number"></igx-column>
    </igx-tree-grid>
    `
})
export class IgxTreeGridPrimaryForeignKeyComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeePrimaryForeignKeyTreeData();
}

@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" childDataKey="Employees" expansionDepth="0" width="900px" height="600px"
        [paging]="true" [perPage]="10">
        <igx-column [field]="'ID'" dataType="number"></igx-column>
        <igx-column [field]="'Name'" dataType="string"></igx-column>
        <igx-column [field]="'HireDate'" dataType="date"></igx-column>
        <igx-column [field]="'Age'" dataType="number"></igx-column>
    </igx-tree-grid>
    `
})
export class IgxTreeGridExpandingComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeTreeData();
}

@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" primaryKey="ID" childDataKey="Employees" expansionDepth="2" width="900px" height="500px"
        [paging]="true" [perPage]="10">
        <igx-column [field]="'ID'" dataType="number"></igx-column>
        <igx-column [field]="'Name'" dataType="string"></igx-column>
        <igx-column [field]="'HireDate'" dataType="date"></igx-column>
        <igx-column [field]="'Age'" dataType="number"></igx-column>
    </igx-tree-grid>
    `
})
export class IgxTreeGridCellSelectionComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeTreeData();
}

// Test Component with 'string' dataType tree-column
@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" childDataKey="Employees" width="900px" height="600px">
        <igx-column [field]="'Name'" dataType="string"></igx-column>
        <igx-column [field]="'ID'" dataType="number"></igx-column>
        <igx-column [field]="'HireDate'" dataType="date"></igx-column>
        <igx-column [field]="'Age'" dataType="number"></igx-column>
    </igx-tree-grid>
    `
})
export class IgxTreeGridStringTreeColumnComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeSmallTreeData();
}

// Test Component with 'date' dataType tree-column
@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" childDataKey="Employees" width="900px" height="600px">
        <igx-column [field]="'HireDate'" dataType="date"></igx-column>
        <igx-column [field]="'Name'" dataType="string"></igx-column>
        <igx-column [field]="'ID'" dataType="number"></igx-column>
        <igx-column [field]="'Age'" dataType="number"></igx-column>
    </igx-tree-grid>
    `
})
export class IgxTreeGridDateTreeColumnComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeSmallTreeData();
}

// Test Component with 'boolean' dataType tree-column
@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" childDataKey="Employees" width="900px" height="600px">
        <igx-column [field]="'OnPTO'" dataType="boolean"></igx-column>
        <igx-column [field]="'HireDate'" dataType="date"></igx-column>
        <igx-column [field]="'Name'" dataType="string"></igx-column>
        <igx-column [field]="'ID'" dataType="number"></igx-column>
        <igx-column [field]="'Age'" dataType="number"></igx-column>
    </igx-tree-grid>
    `
})
export class IgxTreeGridBooleanTreeColumnComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeAllTypesTreeData();
}

// Test Component for CRUD tests
@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" primaryKey="ID" childDataKey="Employees" expansionDepth="2" width="900px" height="600px">
        <igx-column [field]="'ID'" dataType="number" [editable]="true"></igx-column>
        <igx-column [field]="'Name'" dataType="string" [editable]="true"></igx-column>
        <igx-column [field]="'HireDate'" dataType="date" [editable]="true"></igx-column>
        <igx-column [field]="'Age'" dataType="number" [editable]="true"></igx-column>
        <igx-column [field]="'OnPTO'" dataType="boolean" [editable]="true"></igx-column>
    </igx-tree-grid>
    `
})
export class IgxTreeGridCrudComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeTreeData();
}

// Test Component for tree-grid row editing
@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" primaryKey="ID" [rowEditable]='true' childDataKey="Employees" width="900px" height="600px">
        <igx-column [field]="'HireDate'" dataType="date"></igx-column>
        <igx-column [field]="'Name'" dataType="string"></igx-column>
        <igx-column [field]="'ID'" dataType="number"></igx-column>
        <igx-column [field]="'Age'" dataType="number"></igx-column>
    </igx-tree-grid>
    `
})
export class IgxTreeGridRowEditingComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeSmallTreeData();
}

// Test Component for tree-grid filtering and row editing
@Component({
    template: `
        <igx-tree-grid #treeGrid [data]="data" childDataKey="Employees" [rowEditable]="true" width="900px" height="600px">
            <igx-column [field]="'HireDate'" dataType="date" [sortable]="true" [filterable]="true"></igx-column>
            <igx-column [field]="'Name'" dataType="string" [sortable]="true" [filterable]="true"></igx-column>
            <igx-column [field]="'ID'" dataType="number" [sortable]="true" [filterable]="true"></igx-column>
            <igx-column [field]="'Age'" dataType="number" [sortable]="true" [filterable]="true"></igx-column>
        </igx-tree-grid>
    `
})
export class IgxTreeGridFilteringRowEditingComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeTreeData();
}

@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" childDataKey="Employees" primaryKey="ID" width="900px" height="600px">
        <igx-column [editable]="true" [field]="'ID'" dataTtype="number"></igx-column>
        <igx-column [editable]="true" [field]="'Name'" dataType="string"></igx-column>
        <igx-column [editable]="true" [field]="'HireDate'" dataType="date"></igx-column>
        <igx-column [editable]="true" [field]="'Age'" dataType="number"></igx-column>
    </igx-tree-grid>
    `
})
export class IgxTreeGridSelectionRowEditingComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeTreeData();
}

@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" childDataKey="Employees" primaryKey="ID" width="900px" height="600px">
        <igx-column-group header="General Information" >
            <igx-column [field]="'ID'" dataType="number"></igx-column>
            <igx-column [field]="'Name'" dataType="string"></igx-column>
        </igx-column-group>
        <igx-column-group header="Additional Information">
            <igx-column [field]="'HireDate'" dataType="date"></igx-column>
            <igx-column [field]="'Age'" dataType="number"></igx-column>
        </igx-column-group>
    </igx-tree-grid>
    `
})
export class IgxTreeGridMultiColHeadersComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeSmallTreeData();
}


@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" childDataKey="Employees" expansionDepth="0" width="900px" height="1000px">
        <igx-column [field]="'ID'" dataType="number"></igx-column>
        <igx-column [field]="'Name'" dataType="string" [hasSummary]="true"></igx-column>
        <igx-column [field]="'HireDate'" dataType="date" [hasSummary]="true"></igx-column>
        <igx-column [field]="'Age'" dataType="number" [hasSummary]="true"></igx-column>
        <igx-column [field]="'OnPTO'" dataType="boolean" [hasSummary]="true"></igx-column>
    </igx-tree-grid>
    `
})
export class IgxTreeGridSummariesComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeTreeData();
    public ageSummary = AgeSummary;
    public ageSummaryTest = AgeSummaryTest;
}

@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" primaryKey="ID" foreignKey="ParentID" expansionDepth="0"
    width="400px" height="800px">
        <igx-column [field]="'ID'" width="150px" dataType="number"></igx-column>
        <igx-column [field]="'ParentID'" width="150px" dataType="number" [hasSummary]="true"></igx-column>
        <igx-column [field]="'Name'" width="150px" dataType="string" [hasSummary]="true"></igx-column>
        <igx-column [field]="'HireDate'" width="150px" dataType="date" [hasSummary]="true"></igx-column>
        <igx-column [field]="'Age'" width="150px" dataType="number" [hasSummary]="true"></igx-column>
        <igx-column [field]="'OnPTO'" width="150px" dataType="boolean" [hasSummary]="true"></igx-column>
    </igx-tree-grid>
    `
})
export class IgxTreeGridSummariesKeyScroliingComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeTreeDataPrimaryForeignKey();
}

@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" primaryKey="ID" foreignKey="ParentID" expansionDepth="0"
        width="900px" height="1000px" summaryCalculationMode="calculationMode">
        <igx-column [field]="'ID'" dataType="number"></igx-column>
        <igx-column [field]="'Name'" dataType="string" [hasSummary]="true"></igx-column>
        <igx-column [field]="'HireDate'" dataType="date" [hasSummary]="true"></igx-column>
        <igx-column [field]="'Age'" dataType="number" [hasSummary]="true"></igx-column>
        <igx-column [field]="'OnPTO'" dataType="boolean" [hasSummary]="true"></igx-column>
    </igx-tree-grid>
    `
})
export class IgxTreeGridSummariesKeyComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeTreeDataPrimaryForeignKey();
    public calculationMode = 'rootAndChildLevels';
    public ageSummary = AgeSummary;
    public ageSummaryTest = AgeSummaryTest;
}

@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" primaryKey="ID" foreignKey="ParentID" expansionDepth="0"
        width="800px" height="800px" summaryCalculationMode="calculationMode">
        <igx-column [field]="'ID'" dataType="number"></igx-column>
        <igx-column [field]="'Name'" dataType="string" [hasSummary]="true"></igx-column>
        <igx-column [field]="'HireDate'" dataType="date" [hasSummary]="false"></igx-column>
        <igx-column [field]="'Age'" dataType="number" [hasSummary]="true" [summaries]="ageSummary"></igx-column>
        <igx-column [field]="'OnPTO'" dataType="boolean" [hasSummary]="true"></igx-column>
        <igx-column [field]="'ParentID'" dataType="number" [hasSummary]="false"></igx-column>
    </igx-tree-grid>
    `
    , providers: [{ provide: IgxGridTransaction, useClass: IgxTransactionService }]
})
export class IgxTreeGridSummariesTransactionsComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeTreeDataPrimaryForeignKey();
    public calculationMode = 'rootAndChildLevels';
    public ageSummary = AgeSummaryMinMax;
    public ageSummaryTest = AgeSummaryTest;
}

class AgeSummary extends IgxNumberSummaryOperand {
    constructor() {
        super();
    }

    public operate(summaries?: any[]): IgxSummaryResult[] {
        const result = super.operate(summaries).filter((obj) => {
            if (obj.key === 'average' || obj.key === 'sum' || obj.key === 'count') {
                const summaryResult = obj.summaryResult;
                // apply formatting to float numbers
                if (Number(summaryResult) === summaryResult) {
                    obj.summaryResult = summaryResult.toLocaleString('en-us', { maximumFractionDigits: 2 });
                }
                return obj;
            }
        });
        return result;
    }
}

class AgeSummaryMinMax extends IgxNumberSummaryOperand {
    constructor() {
        super();
    }

    public operate(summaries?: any[]): IgxSummaryResult[] {
        const result = super.operate(summaries).filter((obj) => {
            if (obj.key === 'min' || obj.key === 'max') {
                const summaryResult = obj.summaryResult;
                // apply formatting to float numbers
                if (Number(summaryResult) === summaryResult) {
                    obj.summaryResult = summaryResult.toLocaleString('en-us', { maximumFractionDigits: 2 });
                }
                return obj;
            }
        });
        return result;
    }
}

class AgeSummaryTest extends IgxNumberSummaryOperand {
    constructor() {
        super();
    }

    public operate(summaries?: any[]): IgxSummaryResult[] {
        const result = super.operate(summaries);
        result.push({
            key: 'test',
            label: 'Test',
            summaryResult: summaries.filter(rec => rec > 10 && rec < 40).length
        });

        return result;
    }
}

@Component({
    template: `
        <igx-tree-grid #treeGrid [data]="data" primaryKey="ID" foreignKey="ParentID" [rowEditable]="true" width="900px" height="600px">
        <igx-column [field]="'ID'" dataType="number"></igx-column>
        <igx-column [field]="'ParentID'" dataType="number"></igx-column>
        <igx-column [editable]="true" [field]="'Name'" dataType="string"></igx-column>
        <igx-column [editable]="true" [field]="'JobTitle'" dataType="string"></igx-column>
        <igx-column [editable]="true" [field]="'Age'" dataType="number"></igx-column>
    </igx-tree-grid>`
    , providers: [{ provide: IgxGridTransaction, useClass: IgxTransactionService }],
})
export class IgxTreeGridRowEditingTransactionComponent {
    public data = SampleTestData.employeePrimaryForeignKeyTreeData();
    @ViewChild('treeGrid', { read: IgxTreeGridComponent }) public treeGrid: IgxTreeGridComponent;
    public paging = false;
}

@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" childDataKey="Employees" expansionDepth="0" width="900px" height="1000px">
        <igx-column [field]="'ID'" dataType="number"></igx-column>
        <igx-column [field]="'Name'" dataType="string" [hasSummary]="true"></igx-column>
        <igx-column [field]="'HireDate'" dataType="date" [hasSummary]="false"></igx-column>
        <igx-column [field]="'Age'" dataType="number" [hasSummary]="true" [summaries]="ageSummary"></igx-column>
        <igx-column [field]="'OnPTO'" dataType="boolean" [hasSummary]="true"></igx-column>
    </igx-tree-grid>
    `
})
export class IgxTreeGridCustomSummariesComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeTreeData();
    public ageSummary = AgeSummary;
    public ageSummaryTest = AgeSummaryTest;
}

@Component({
    template: `<igx-tree-grid #treeGrid [data]="data" primaryKey="ID" childDataKey="Employees"
    [rowEditable]="true" width="900px" height="600px">
        <igx-column [field]="'ID'" dataType="number"></igx-column>
        <igx-column [editable]="true" [field]="'Name'" dataType="string"></igx-column>
        <igx-column [editable]="true" [field]="'HireDate'" dataType="date"></igx-column>
        <igx-column [editable]="true" [field]="'Age'" dataType="number"></igx-column>
        <igx-column [editable]="true" [field]="'OnPTO'" dataType="boolean"></igx-column>
    </igx-tree-grid>`
    , providers: [{ provide: IgxGridTransaction, useClass: IgxHierarchicalTransactionService }],
})
export class IgxTreeGridRowEditingHierarchicalDSTransactionComponent {
    public data = SampleTestData.employeeAllTypesTreeData();
    @ViewChild('treeGrid', { read: IgxTreeGridComponent }) public treeGrid: IgxTreeGridComponent;
    public paging = false;
}

@Component({
    template:
        `<div [style.width.px]="outerWidth" [style.height.px]="outerHeight">
            <igx-tree-grid #treeGrid [data]="data" [displayDensity]="density"
                childDataKey="Employees" primaryKey="ID">
                <igx-column [field]="'ID'" dataType="number"></igx-column>
                <igx-column [field]="'Name'" dataType="string"></igx-column>
                <igx-column [field]="'HireDate'" dataType="date"></igx-column>
                <igx-column [field]="'Age'" dataType="number"></igx-column>
        </igx-tree-grid>
        </div>`
})

export class IgxTreeGridWrappedInContComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeTreeData();

    public height = null;
    public paging = false;
    public pageSize = 5;
    public density = DisplayDensity.comfortable;
    public outerWidth = 800;
    public outerHeight: number;

    public isHorizontalScrollbarVisible() {
        const scrollbar = this.treeGrid.parentVirtDir.getHorizontalScroll();
        if (scrollbar) {
            return scrollbar.offsetWidth < scrollbar.children[0].offsetWidth;
        }

        return false;
    }

    public getVerticalScrollHeight() {
        const scrollbar = this.treeGrid.verticalScrollContainer.getVerticalScroll();
        if (scrollbar) {
            return parseInt(scrollbar.style.height, 10);
        }

        return 0;
    }

    public isVerticalScrollbarVisible() {
        const scrollbar = this.treeGrid.verticalScrollContainer.getVerticalScroll();
        if (scrollbar && scrollbar.offsetHeight > 0) {
            return scrollbar.offsetHeight < scrollbar.children[0].offsetHeight;
        }
        return false;
    }

}

@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" primaryKey="employeeID" foreignKey="PID" width="900px" height="800px">
        <igx-column [field]="'employeeID'" dataType="number"></igx-column>
        <igx-column [field]="'firstName'"></igx-column>
        <igx-column [field]="'lastName'"></igx-column>
        <igx-column [field]="'Salary'" dataType="number" [hasSummary]="true" ></igx-column>
    </igx-tree-grid>
    `
})
export class IgxTreeGridSummariesScrollingComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeScrollingData();
}

@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" childDataKey="Employees" width="900px" height="600px">
        <igx-column [field]="'JobTitle'" dataType="string"></igx-column>
        <igx-column [field]="'ID'" dataType="number"></igx-column>
        <igx-column [field]="'Name'" dataType="string"></igx-column>
        <igx-column [field]="'HireDate'" dataType="date"></igx-column>
        <igx-column [field]="'Age'" dataType="number"></igx-column>
    </igx-tree-grid>
    `
})
export class IgxTreeGridSearchComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeSearchTreeData();
}

@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" primaryKey="ID" foreignKey="ParentID" width="500px" height="600px"columnWidth="150px" >
        <igx-column [field]="'ID'" dataType="number"></igx-column>
        <igx-column [field]="'Name'" dataType="string"></igx-column>
        <igx-column [field]="'Age'" dataType="number"></igx-column>
        <igx-column [field]="'OnPTO'" dataType="boolean"></igx-column>
        <igx-column [field]="'HireDate'" dataType="date"></igx-column>
    </igx-tree-grid>
    `
})
export class IgxTreeGridSelectionKeyComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeTreeDataPrimaryForeignKey();
}

@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" childDataKey="Employees" width="500px" height="600px"columnWidth="150px">
        <igx-column [field]="'ID'" dataType="number"></igx-column>
        <igx-column [field]="'Name'" dataType="string"></igx-column>
        <igx-column [field]="'Age'" dataType="number"></igx-column>
        <igx-column [field]="'OnPTO'" dataType="boolean"></igx-column>
        <igx-column [field]="'HireDate'" dataType="date"></igx-column>
    </igx-tree-grid>
    `
})
export class IgxTreeGridSelectionComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeTreeData();
}

@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" childDataKey="Employees" width="800px" height="600px" columnWidth="150px" primaryKey="ID">
        <igx-column [field]="'ID'" dataType="number"></igx-column>
        <igx-column [field]="'Name'" dataType="string"></igx-column>
        <igx-column [field]="'Age'" dataType="number"></igx-column>
        <igx-column [field]="'OnPTO'" dataType="boolean"></igx-column>
        <igx-column [field]="'HireDate'" dataType="date"></igx-column>
    </igx-tree-grid>
    `, providers: [{ provide: IgxGridTransaction, useClass: IgxHierarchicalTransactionService }]
})
export class IgxTreeGridSelectionWithTransactionComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeTreeData();
}

@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" primaryKey="ID" foreignKey="ParentID" width="500px" height="600px"columnWidth="150px" >
        <igx-column [field]="'ID'" dataType="number"></igx-column>
        <igx-column [field]="'Name'" dataType="string"></igx-column>
        <igx-column [field]="'Age'" dataType="number"></igx-column>
        <igx-column [field]="'OnPTO'" dataType="boolean"></igx-column>
        <igx-column [field]="'HireDate'" dataType="date"></igx-column>
    </igx-tree-grid>
    `, providers: [{ provide: IgxGridTransaction, useClass: IgxTransactionService }]
})
export class IgxTreeGridFKeySelectionWithTransactionComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeTreeDataPrimaryForeignKey();
}

@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" [autoGenerate]="true" primaryKey="ID" foreignKey="ParentID" width="900px" height="600px">
    </igx-tree-grid>
    `
})
export class IgxTreeGridAutoGenerateComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeePrimaryForeignKeyTreeData();
}
