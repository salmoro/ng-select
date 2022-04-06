import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgDropdownPanelComponent } from './ng-dropdown-panel.component';
import { NgOptionComponent } from './ng-option.component';
import { NgSelectComponent, SELECTION_MODEL_FACTORY } from './ng-select.component';
import { NgFooterTemplateDirective, NgHeaderTemplateDirective, NgLabelTemplateDirective, NgLoadingSpinnerTemplateDirective, NgLoadingTextTemplateDirective, NgMultiLabelTemplateDirective, NgNotFoundTemplateDirective, NgOptgroupTemplateDirective, NgOptionTemplateDirective, NgTagTemplateDirective, NgItemLabelDirective, NgTypeToSearchTemplateDirective } from './ng-templates.directive';
import { DefaultSelectionModelFactory } from './selection-model';
import * as i0 from "@angular/core";
export class NgSelectModule {
}
NgSelectModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: NgSelectModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
NgSelectModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: NgSelectModule, declarations: [NgDropdownPanelComponent,
        NgOptionComponent,
        NgSelectComponent,
        NgOptgroupTemplateDirective,
        NgOptionTemplateDirective,
        NgLabelTemplateDirective,
        NgMultiLabelTemplateDirective,
        NgHeaderTemplateDirective,
        NgFooterTemplateDirective,
        NgNotFoundTemplateDirective,
        NgTypeToSearchTemplateDirective,
        NgLoadingTextTemplateDirective,
        NgTagTemplateDirective,
        NgLoadingSpinnerTemplateDirective,
        NgItemLabelDirective], imports: [CommonModule], exports: [NgSelectComponent,
        NgOptionComponent,
        NgOptgroupTemplateDirective,
        NgOptionTemplateDirective,
        NgLabelTemplateDirective,
        NgMultiLabelTemplateDirective,
        NgHeaderTemplateDirective,
        NgFooterTemplateDirective,
        NgNotFoundTemplateDirective,
        NgTypeToSearchTemplateDirective,
        NgLoadingTextTemplateDirective,
        NgTagTemplateDirective,
        NgLoadingSpinnerTemplateDirective] });
NgSelectModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: NgSelectModule, providers: [
        { provide: SELECTION_MODEL_FACTORY, useValue: DefaultSelectionModelFactory }
    ], imports: [[
            CommonModule
        ]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: NgSelectModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        NgDropdownPanelComponent,
                        NgOptionComponent,
                        NgSelectComponent,
                        NgOptgroupTemplateDirective,
                        NgOptionTemplateDirective,
                        NgLabelTemplateDirective,
                        NgMultiLabelTemplateDirective,
                        NgHeaderTemplateDirective,
                        NgFooterTemplateDirective,
                        NgNotFoundTemplateDirective,
                        NgTypeToSearchTemplateDirective,
                        NgLoadingTextTemplateDirective,
                        NgTagTemplateDirective,
                        NgLoadingSpinnerTemplateDirective,
                        NgItemLabelDirective
                    ],
                    imports: [
                        CommonModule
                    ],
                    exports: [
                        NgSelectComponent,
                        NgOptionComponent,
                        NgOptgroupTemplateDirective,
                        NgOptionTemplateDirective,
                        NgLabelTemplateDirective,
                        NgMultiLabelTemplateDirective,
                        NgHeaderTemplateDirective,
                        NgFooterTemplateDirective,
                        NgNotFoundTemplateDirective,
                        NgTypeToSearchTemplateDirective,
                        NgLoadingTextTemplateDirective,
                        NgTagTemplateDirective,
                        NgLoadingSpinnerTemplateDirective
                    ],
                    providers: [
                        { provide: SELECTION_MODEL_FACTORY, useValue: DefaultSelectionModelFactory }
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctc2VsZWN0Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9uZy1zZWxlY3QvbGliL25nLXNlbGVjdC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDekUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDMUQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLHVCQUF1QixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDbkYsT0FBTyxFQUNILHlCQUF5QixFQUN6Qix5QkFBeUIsRUFDekIsd0JBQXdCLEVBQ3hCLGlDQUFpQyxFQUNqQyw4QkFBOEIsRUFDOUIsNkJBQTZCLEVBQzdCLDJCQUEyQixFQUMzQiwyQkFBMkIsRUFDM0IseUJBQXlCLEVBQ3pCLHNCQUFzQixFQUN0QixvQkFBb0IsRUFDcEIsK0JBQStCLEVBQ2xDLE1BQU0sMEJBQTBCLENBQUM7QUFDbEMsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sbUJBQW1CLENBQUM7O0FBMENqRSxNQUFNLE9BQU8sY0FBYzs7MkdBQWQsY0FBYzs0R0FBZCxjQUFjLGlCQXRDbkIsd0JBQXdCO1FBQ3hCLGlCQUFpQjtRQUNqQixpQkFBaUI7UUFDakIsMkJBQTJCO1FBQzNCLHlCQUF5QjtRQUN6Qix3QkFBd0I7UUFDeEIsNkJBQTZCO1FBQzdCLHlCQUF5QjtRQUN6Qix5QkFBeUI7UUFDekIsMkJBQTJCO1FBQzNCLCtCQUErQjtRQUMvQiw4QkFBOEI7UUFDOUIsc0JBQXNCO1FBQ3RCLGlDQUFpQztRQUNqQyxvQkFBb0IsYUFHcEIsWUFBWSxhQUdaLGlCQUFpQjtRQUNqQixpQkFBaUI7UUFDakIsMkJBQTJCO1FBQzNCLHlCQUF5QjtRQUN6Qix3QkFBd0I7UUFDeEIsNkJBQTZCO1FBQzdCLHlCQUF5QjtRQUN6Qix5QkFBeUI7UUFDekIsMkJBQTJCO1FBQzNCLCtCQUErQjtRQUMvQiw4QkFBOEI7UUFDOUIsc0JBQXNCO1FBQ3RCLGlDQUFpQzs0R0FNNUIsY0FBYyxhQUpaO1FBQ1AsRUFBRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsUUFBUSxFQUFFLDRCQUE0QixFQUFFO0tBQy9FLFlBcEJRO1lBQ0wsWUFBWTtTQUNmOzJGQW9CUSxjQUFjO2tCQXhDMUIsUUFBUTttQkFBQztvQkFDTixZQUFZLEVBQUU7d0JBQ1Ysd0JBQXdCO3dCQUN4QixpQkFBaUI7d0JBQ2pCLGlCQUFpQjt3QkFDakIsMkJBQTJCO3dCQUMzQix5QkFBeUI7d0JBQ3pCLHdCQUF3Qjt3QkFDeEIsNkJBQTZCO3dCQUM3Qix5QkFBeUI7d0JBQ3pCLHlCQUF5Qjt3QkFDekIsMkJBQTJCO3dCQUMzQiwrQkFBK0I7d0JBQy9CLDhCQUE4Qjt3QkFDOUIsc0JBQXNCO3dCQUN0QixpQ0FBaUM7d0JBQ2pDLG9CQUFvQjtxQkFDdkI7b0JBQ0QsT0FBTyxFQUFFO3dCQUNMLFlBQVk7cUJBQ2Y7b0JBQ0QsT0FBTyxFQUFFO3dCQUNMLGlCQUFpQjt3QkFDakIsaUJBQWlCO3dCQUNqQiwyQkFBMkI7d0JBQzNCLHlCQUF5Qjt3QkFDekIsd0JBQXdCO3dCQUN4Qiw2QkFBNkI7d0JBQzdCLHlCQUF5Qjt3QkFDekIseUJBQXlCO3dCQUN6QiwyQkFBMkI7d0JBQzNCLCtCQUErQjt3QkFDL0IsOEJBQThCO3dCQUM5QixzQkFBc0I7d0JBQ3RCLGlDQUFpQztxQkFDcEM7b0JBQ0QsU0FBUyxFQUFFO3dCQUNQLEVBQUUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFFBQVEsRUFBRSw0QkFBNEIsRUFBRTtxQkFDL0U7aUJBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBOZ0Ryb3Bkb3duUGFuZWxDb21wb25lbnQgfSBmcm9tICcuL25nLWRyb3Bkb3duLXBhbmVsLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IE5nT3B0aW9uQ29tcG9uZW50IH0gZnJvbSAnLi9uZy1vcHRpb24uY29tcG9uZW50JztcclxuaW1wb3J0IHsgTmdTZWxlY3RDb21wb25lbnQsIFNFTEVDVElPTl9NT0RFTF9GQUNUT1JZIH0gZnJvbSAnLi9uZy1zZWxlY3QuY29tcG9uZW50JztcclxuaW1wb3J0IHtcclxuICAgIE5nRm9vdGVyVGVtcGxhdGVEaXJlY3RpdmUsXHJcbiAgICBOZ0hlYWRlclRlbXBsYXRlRGlyZWN0aXZlLFxyXG4gICAgTmdMYWJlbFRlbXBsYXRlRGlyZWN0aXZlLFxyXG4gICAgTmdMb2FkaW5nU3Bpbm5lclRlbXBsYXRlRGlyZWN0aXZlLFxyXG4gICAgTmdMb2FkaW5nVGV4dFRlbXBsYXRlRGlyZWN0aXZlLFxyXG4gICAgTmdNdWx0aUxhYmVsVGVtcGxhdGVEaXJlY3RpdmUsXHJcbiAgICBOZ05vdEZvdW5kVGVtcGxhdGVEaXJlY3RpdmUsXHJcbiAgICBOZ09wdGdyb3VwVGVtcGxhdGVEaXJlY3RpdmUsXHJcbiAgICBOZ09wdGlvblRlbXBsYXRlRGlyZWN0aXZlLFxyXG4gICAgTmdUYWdUZW1wbGF0ZURpcmVjdGl2ZSxcclxuICAgIE5nSXRlbUxhYmVsRGlyZWN0aXZlLFxyXG4gICAgTmdUeXBlVG9TZWFyY2hUZW1wbGF0ZURpcmVjdGl2ZVxyXG59IGZyb20gJy4vbmctdGVtcGxhdGVzLmRpcmVjdGl2ZSc7XHJcbmltcG9ydCB7IERlZmF1bHRTZWxlY3Rpb25Nb2RlbEZhY3RvcnkgfSBmcm9tICcuL3NlbGVjdGlvbi1tb2RlbCc7XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gICAgZGVjbGFyYXRpb25zOiBbXHJcbiAgICAgICAgTmdEcm9wZG93blBhbmVsQ29tcG9uZW50LFxyXG4gICAgICAgIE5nT3B0aW9uQ29tcG9uZW50LFxyXG4gICAgICAgIE5nU2VsZWN0Q29tcG9uZW50LFxyXG4gICAgICAgIE5nT3B0Z3JvdXBUZW1wbGF0ZURpcmVjdGl2ZSxcclxuICAgICAgICBOZ09wdGlvblRlbXBsYXRlRGlyZWN0aXZlLFxyXG4gICAgICAgIE5nTGFiZWxUZW1wbGF0ZURpcmVjdGl2ZSxcclxuICAgICAgICBOZ011bHRpTGFiZWxUZW1wbGF0ZURpcmVjdGl2ZSxcclxuICAgICAgICBOZ0hlYWRlclRlbXBsYXRlRGlyZWN0aXZlLFxyXG4gICAgICAgIE5nRm9vdGVyVGVtcGxhdGVEaXJlY3RpdmUsXHJcbiAgICAgICAgTmdOb3RGb3VuZFRlbXBsYXRlRGlyZWN0aXZlLFxyXG4gICAgICAgIE5nVHlwZVRvU2VhcmNoVGVtcGxhdGVEaXJlY3RpdmUsXHJcbiAgICAgICAgTmdMb2FkaW5nVGV4dFRlbXBsYXRlRGlyZWN0aXZlLFxyXG4gICAgICAgIE5nVGFnVGVtcGxhdGVEaXJlY3RpdmUsXHJcbiAgICAgICAgTmdMb2FkaW5nU3Bpbm5lclRlbXBsYXRlRGlyZWN0aXZlLFxyXG4gICAgICAgIE5nSXRlbUxhYmVsRGlyZWN0aXZlXHJcbiAgICBdLFxyXG4gICAgaW1wb3J0czogW1xyXG4gICAgICAgIENvbW1vbk1vZHVsZVxyXG4gICAgXSxcclxuICAgIGV4cG9ydHM6IFtcclxuICAgICAgICBOZ1NlbGVjdENvbXBvbmVudCxcclxuICAgICAgICBOZ09wdGlvbkNvbXBvbmVudCxcclxuICAgICAgICBOZ09wdGdyb3VwVGVtcGxhdGVEaXJlY3RpdmUsXHJcbiAgICAgICAgTmdPcHRpb25UZW1wbGF0ZURpcmVjdGl2ZSxcclxuICAgICAgICBOZ0xhYmVsVGVtcGxhdGVEaXJlY3RpdmUsXHJcbiAgICAgICAgTmdNdWx0aUxhYmVsVGVtcGxhdGVEaXJlY3RpdmUsXHJcbiAgICAgICAgTmdIZWFkZXJUZW1wbGF0ZURpcmVjdGl2ZSxcclxuICAgICAgICBOZ0Zvb3RlclRlbXBsYXRlRGlyZWN0aXZlLFxyXG4gICAgICAgIE5nTm90Rm91bmRUZW1wbGF0ZURpcmVjdGl2ZSxcclxuICAgICAgICBOZ1R5cGVUb1NlYXJjaFRlbXBsYXRlRGlyZWN0aXZlLFxyXG4gICAgICAgIE5nTG9hZGluZ1RleHRUZW1wbGF0ZURpcmVjdGl2ZSxcclxuICAgICAgICBOZ1RhZ1RlbXBsYXRlRGlyZWN0aXZlLFxyXG4gICAgICAgIE5nTG9hZGluZ1NwaW5uZXJUZW1wbGF0ZURpcmVjdGl2ZVxyXG4gICAgXSxcclxuICAgIHByb3ZpZGVyczogW1xyXG4gICAgICAgIHsgcHJvdmlkZTogU0VMRUNUSU9OX01PREVMX0ZBQ1RPUlksIHVzZVZhbHVlOiBEZWZhdWx0U2VsZWN0aW9uTW9kZWxGYWN0b3J5IH1cclxuICAgIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIE5nU2VsZWN0TW9kdWxlIHt9XHJcbiJdfQ==