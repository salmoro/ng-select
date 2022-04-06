import { Directive, Input } from '@angular/core';
import { escapeHTML } from './value-utils';
import * as i0 from "@angular/core";
export class NgItemLabelDirective {
    constructor(element) {
        this.element = element;
        this.escape = true;
    }
    ngOnChanges(changes) {
        this.element.nativeElement.innerHTML = this.escape ?
            escapeHTML(this.ngItemLabel) :
            this.ngItemLabel;
    }
}
NgItemLabelDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: NgItemLabelDirective, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
NgItemLabelDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0", type: NgItemLabelDirective, selector: "[ngItemLabel]", inputs: { ngItemLabel: "ngItemLabel", escape: "escape" }, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: NgItemLabelDirective, decorators: [{
            type: Directive,
            args: [{ selector: '[ngItemLabel]' }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { ngItemLabel: [{
                type: Input
            }], escape: [{
                type: Input
            }] } });
// eslint-disable-next-line @angular-eslint/directive-selector
export class NgOptionTemplateDirective {
    constructor(template) {
        this.template = template;
    }
}
NgOptionTemplateDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: NgOptionTemplateDirective, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
NgOptionTemplateDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0", type: NgOptionTemplateDirective, selector: "[ng-option-tmp]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: NgOptionTemplateDirective, decorators: [{
            type: Directive,
            args: [{ selector: '[ng-option-tmp]' }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });
// eslint-disable-next-line @angular-eslint/directive-selector
export class NgOptgroupTemplateDirective {
    constructor(template) {
        this.template = template;
    }
}
NgOptgroupTemplateDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: NgOptgroupTemplateDirective, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
NgOptgroupTemplateDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0", type: NgOptgroupTemplateDirective, selector: "[ng-optgroup-tmp]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: NgOptgroupTemplateDirective, decorators: [{
            type: Directive,
            args: [{ selector: '[ng-optgroup-tmp]' }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });
// eslint-disable-next-line @angular-eslint/directive-selector
export class NgLabelTemplateDirective {
    constructor(template) {
        this.template = template;
    }
}
NgLabelTemplateDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: NgLabelTemplateDirective, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
NgLabelTemplateDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0", type: NgLabelTemplateDirective, selector: "[ng-label-tmp]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: NgLabelTemplateDirective, decorators: [{
            type: Directive,
            args: [{ selector: '[ng-label-tmp]' }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });
// eslint-disable-next-line @angular-eslint/directive-selector
export class NgMultiLabelTemplateDirective {
    constructor(template) {
        this.template = template;
    }
}
NgMultiLabelTemplateDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: NgMultiLabelTemplateDirective, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
NgMultiLabelTemplateDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0", type: NgMultiLabelTemplateDirective, selector: "[ng-multi-label-tmp]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: NgMultiLabelTemplateDirective, decorators: [{
            type: Directive,
            args: [{ selector: '[ng-multi-label-tmp]' }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });
// eslint-disable-next-line @angular-eslint/directive-selector
export class NgHeaderTemplateDirective {
    constructor(template) {
        this.template = template;
    }
}
NgHeaderTemplateDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: NgHeaderTemplateDirective, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
NgHeaderTemplateDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0", type: NgHeaderTemplateDirective, selector: "[ng-header-tmp]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: NgHeaderTemplateDirective, decorators: [{
            type: Directive,
            args: [{ selector: '[ng-header-tmp]' }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });
// eslint-disable-next-line @angular-eslint/directive-selector
export class NgFooterTemplateDirective {
    constructor(template) {
        this.template = template;
    }
}
NgFooterTemplateDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: NgFooterTemplateDirective, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
NgFooterTemplateDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0", type: NgFooterTemplateDirective, selector: "[ng-footer-tmp]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: NgFooterTemplateDirective, decorators: [{
            type: Directive,
            args: [{ selector: '[ng-footer-tmp]' }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });
// eslint-disable-next-line @angular-eslint/directive-selector
export class NgNotFoundTemplateDirective {
    constructor(template) {
        this.template = template;
    }
}
NgNotFoundTemplateDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: NgNotFoundTemplateDirective, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
NgNotFoundTemplateDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0", type: NgNotFoundTemplateDirective, selector: "[ng-notfound-tmp]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: NgNotFoundTemplateDirective, decorators: [{
            type: Directive,
            args: [{ selector: '[ng-notfound-tmp]' }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });
// eslint-disable-next-line @angular-eslint/directive-selector
export class NgTypeToSearchTemplateDirective {
    constructor(template) {
        this.template = template;
    }
}
NgTypeToSearchTemplateDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: NgTypeToSearchTemplateDirective, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
NgTypeToSearchTemplateDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0", type: NgTypeToSearchTemplateDirective, selector: "[ng-typetosearch-tmp]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: NgTypeToSearchTemplateDirective, decorators: [{
            type: Directive,
            args: [{ selector: '[ng-typetosearch-tmp]' }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });
// eslint-disable-next-line @angular-eslint/directive-selector
export class NgLoadingTextTemplateDirective {
    constructor(template) {
        this.template = template;
    }
}
NgLoadingTextTemplateDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: NgLoadingTextTemplateDirective, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
NgLoadingTextTemplateDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0", type: NgLoadingTextTemplateDirective, selector: "[ng-loadingtext-tmp]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: NgLoadingTextTemplateDirective, decorators: [{
            type: Directive,
            args: [{ selector: '[ng-loadingtext-tmp]' }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });
// eslint-disable-next-line @angular-eslint/directive-selector
export class NgTagTemplateDirective {
    constructor(template) {
        this.template = template;
    }
}
NgTagTemplateDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: NgTagTemplateDirective, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
NgTagTemplateDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0", type: NgTagTemplateDirective, selector: "[ng-tag-tmp]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: NgTagTemplateDirective, decorators: [{
            type: Directive,
            args: [{ selector: '[ng-tag-tmp]' }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });
// eslint-disable-next-line @angular-eslint/directive-selector
export class NgLoadingSpinnerTemplateDirective {
    constructor(template) {
        this.template = template;
    }
}
NgLoadingSpinnerTemplateDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: NgLoadingSpinnerTemplateDirective, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
NgLoadingSpinnerTemplateDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0", type: NgLoadingSpinnerTemplateDirective, selector: "[ng-loadingspinner-tmp]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: NgLoadingSpinnerTemplateDirective, decorators: [{
            type: Directive,
            args: [{ selector: '[ng-loadingspinner-tmp]' }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctdGVtcGxhdGVzLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9uZy1zZWxlY3QvbGliL25nLXRlbXBsYXRlcy5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBYyxLQUFLLEVBQXlDLE1BQU0sZUFBZSxDQUFDO0FBQ3BHLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBRzNDLE1BQU0sT0FBTyxvQkFBb0I7SUFJN0IsWUFBb0IsT0FBZ0M7UUFBaEMsWUFBTyxHQUFQLE9BQU8sQ0FBeUI7UUFGM0MsV0FBTSxHQUFHLElBQUksQ0FBQztJQUVpQyxDQUFDO0lBRXpELFdBQVcsQ0FBQyxPQUFzQjtRQUM5QixJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2hELFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsV0FBVyxDQUFDO0lBQ3pCLENBQUM7O2lIQVZRLG9CQUFvQjtxR0FBcEIsb0JBQW9COzJGQUFwQixvQkFBb0I7a0JBRGhDLFNBQVM7bUJBQUMsRUFBRSxRQUFRLEVBQUUsZUFBZSxFQUFFO2lHQUUzQixXQUFXO3NCQUFuQixLQUFLO2dCQUNHLE1BQU07c0JBQWQsS0FBSzs7QUFXViw4REFBOEQ7QUFFOUQsTUFBTSxPQUFPLHlCQUF5QjtJQUNsQyxZQUFtQixRQUEwQjtRQUExQixhQUFRLEdBQVIsUUFBUSxDQUFrQjtJQUFJLENBQUM7O3NIQUR6Qyx5QkFBeUI7MEdBQXpCLHlCQUF5QjsyRkFBekIseUJBQXlCO2tCQURyQyxTQUFTO21CQUFDLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixFQUFFOztBQUsxQyw4REFBOEQ7QUFFOUQsTUFBTSxPQUFPLDJCQUEyQjtJQUNwQyxZQUFtQixRQUEwQjtRQUExQixhQUFRLEdBQVIsUUFBUSxDQUFrQjtJQUFJLENBQUM7O3dIQUR6QywyQkFBMkI7NEdBQTNCLDJCQUEyQjsyRkFBM0IsMkJBQTJCO2tCQUR2QyxTQUFTO21CQUFDLEVBQUUsUUFBUSxFQUFFLG1CQUFtQixFQUFFOztBQUs1Qyw4REFBOEQ7QUFFOUQsTUFBTSxPQUFPLHdCQUF3QjtJQUNqQyxZQUFtQixRQUEwQjtRQUExQixhQUFRLEdBQVIsUUFBUSxDQUFrQjtJQUFJLENBQUM7O3FIQUR6Qyx3QkFBd0I7eUdBQXhCLHdCQUF3QjsyRkFBeEIsd0JBQXdCO2tCQURwQyxTQUFTO21CQUFDLEVBQUUsUUFBUSxFQUFFLGdCQUFnQixFQUFFOztBQUt6Qyw4REFBOEQ7QUFFOUQsTUFBTSxPQUFPLDZCQUE2QjtJQUN0QyxZQUFtQixRQUEwQjtRQUExQixhQUFRLEdBQVIsUUFBUSxDQUFrQjtJQUFJLENBQUM7OzBIQUR6Qyw2QkFBNkI7OEdBQTdCLDZCQUE2QjsyRkFBN0IsNkJBQTZCO2tCQUR6QyxTQUFTO21CQUFDLEVBQUUsUUFBUSxFQUFFLHNCQUFzQixFQUFFOztBQUsvQyw4REFBOEQ7QUFFOUQsTUFBTSxPQUFPLHlCQUF5QjtJQUNsQyxZQUFtQixRQUEwQjtRQUExQixhQUFRLEdBQVIsUUFBUSxDQUFrQjtJQUFJLENBQUM7O3NIQUR6Qyx5QkFBeUI7MEdBQXpCLHlCQUF5QjsyRkFBekIseUJBQXlCO2tCQURyQyxTQUFTO21CQUFDLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixFQUFFOztBQUsxQyw4REFBOEQ7QUFFOUQsTUFBTSxPQUFPLHlCQUF5QjtJQUNsQyxZQUFtQixRQUEwQjtRQUExQixhQUFRLEdBQVIsUUFBUSxDQUFrQjtJQUFJLENBQUM7O3NIQUR6Qyx5QkFBeUI7MEdBQXpCLHlCQUF5QjsyRkFBekIseUJBQXlCO2tCQURyQyxTQUFTO21CQUFDLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixFQUFFOztBQUsxQyw4REFBOEQ7QUFFOUQsTUFBTSxPQUFPLDJCQUEyQjtJQUNwQyxZQUFtQixRQUEwQjtRQUExQixhQUFRLEdBQVIsUUFBUSxDQUFrQjtJQUFJLENBQUM7O3dIQUR6QywyQkFBMkI7NEdBQTNCLDJCQUEyQjsyRkFBM0IsMkJBQTJCO2tCQUR2QyxTQUFTO21CQUFDLEVBQUUsUUFBUSxFQUFFLG1CQUFtQixFQUFFOztBQUs1Qyw4REFBOEQ7QUFFOUQsTUFBTSxPQUFPLCtCQUErQjtJQUN4QyxZQUFtQixRQUEwQjtRQUExQixhQUFRLEdBQVIsUUFBUSxDQUFrQjtJQUFJLENBQUM7OzRIQUR6QywrQkFBK0I7Z0hBQS9CLCtCQUErQjsyRkFBL0IsK0JBQStCO2tCQUQzQyxTQUFTO21CQUFDLEVBQUUsUUFBUSxFQUFFLHVCQUF1QixFQUFFOztBQUtoRCw4REFBOEQ7QUFFOUQsTUFBTSxPQUFPLDhCQUE4QjtJQUN2QyxZQUFtQixRQUEwQjtRQUExQixhQUFRLEdBQVIsUUFBUSxDQUFrQjtJQUFJLENBQUM7OzJIQUR6Qyw4QkFBOEI7K0dBQTlCLDhCQUE4QjsyRkFBOUIsOEJBQThCO2tCQUQxQyxTQUFTO21CQUFDLEVBQUUsUUFBUSxFQUFFLHNCQUFzQixFQUFFOztBQUsvQyw4REFBOEQ7QUFFOUQsTUFBTSxPQUFPLHNCQUFzQjtJQUMvQixZQUFtQixRQUEwQjtRQUExQixhQUFRLEdBQVIsUUFBUSxDQUFrQjtJQUFJLENBQUM7O21IQUR6QyxzQkFBc0I7dUdBQXRCLHNCQUFzQjsyRkFBdEIsc0JBQXNCO2tCQURsQyxTQUFTO21CQUFDLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBRTs7QUFLdkMsOERBQThEO0FBRTlELE1BQU0sT0FBTyxpQ0FBaUM7SUFDMUMsWUFBbUIsUUFBMEI7UUFBMUIsYUFBUSxHQUFSLFFBQVEsQ0FBa0I7SUFBSSxDQUFDOzs4SEFEekMsaUNBQWlDO2tIQUFqQyxpQ0FBaUM7MkZBQWpDLGlDQUFpQztrQkFEN0MsU0FBUzttQkFBQyxFQUFFLFFBQVEsRUFBRSx5QkFBeUIsRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSW5wdXQsIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlcywgVGVtcGxhdGVSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgZXNjYXBlSFRNTCB9IGZyb20gJy4vdmFsdWUtdXRpbHMnO1xyXG5cclxuQERpcmVjdGl2ZSh7IHNlbGVjdG9yOiAnW25nSXRlbUxhYmVsXScgfSlcclxuZXhwb3J0IGNsYXNzIE5nSXRlbUxhYmVsRGlyZWN0aXZlIGltcGxlbWVudHMgT25DaGFuZ2VzIHtcclxuICAgIEBJbnB1dCgpIG5nSXRlbUxhYmVsOiBzdHJpbmc7XHJcbiAgICBASW5wdXQoKSBlc2NhcGUgPSB0cnVlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZWxlbWVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4pIHsgfVxyXG5cclxuICAgIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcclxuICAgICAgICB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5pbm5lckhUTUwgPSB0aGlzLmVzY2FwZSA/XHJcbiAgICAgICAgICAgIGVzY2FwZUhUTUwodGhpcy5uZ0l0ZW1MYWJlbCkgOlxyXG4gICAgICAgICAgICB0aGlzLm5nSXRlbUxhYmVsO1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQGFuZ3VsYXItZXNsaW50L2RpcmVjdGl2ZS1zZWxlY3RvclxyXG5ARGlyZWN0aXZlKHsgc2VsZWN0b3I6ICdbbmctb3B0aW9uLXRtcF0nIH0pXHJcbmV4cG9ydCBjbGFzcyBOZ09wdGlvblRlbXBsYXRlRGlyZWN0aXZlIHtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB0ZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PikgeyB9XHJcbn1cclxuXHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAYW5ndWxhci1lc2xpbnQvZGlyZWN0aXZlLXNlbGVjdG9yXHJcbkBEaXJlY3RpdmUoeyBzZWxlY3RvcjogJ1tuZy1vcHRncm91cC10bXBdJyB9KVxyXG5leHBvcnQgY2xhc3MgTmdPcHRncm91cFRlbXBsYXRlRGlyZWN0aXZlIHtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB0ZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PikgeyB9XHJcbn1cclxuXHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAYW5ndWxhci1lc2xpbnQvZGlyZWN0aXZlLXNlbGVjdG9yXHJcbkBEaXJlY3RpdmUoeyBzZWxlY3RvcjogJ1tuZy1sYWJlbC10bXBdJyB9KVxyXG5leHBvcnQgY2xhc3MgTmdMYWJlbFRlbXBsYXRlRGlyZWN0aXZlIHtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB0ZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PikgeyB9XHJcbn1cclxuXHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAYW5ndWxhci1lc2xpbnQvZGlyZWN0aXZlLXNlbGVjdG9yXHJcbkBEaXJlY3RpdmUoeyBzZWxlY3RvcjogJ1tuZy1tdWx0aS1sYWJlbC10bXBdJyB9KVxyXG5leHBvcnQgY2xhc3MgTmdNdWx0aUxhYmVsVGVtcGxhdGVEaXJlY3RpdmUge1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+KSB7IH1cclxufVxyXG5cclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEBhbmd1bGFyLWVzbGludC9kaXJlY3RpdmUtc2VsZWN0b3JcclxuQERpcmVjdGl2ZSh7IHNlbGVjdG9yOiAnW25nLWhlYWRlci10bXBdJyB9KVxyXG5leHBvcnQgY2xhc3MgTmdIZWFkZXJUZW1wbGF0ZURpcmVjdGl2ZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4pIHsgfVxyXG59XHJcblxyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQGFuZ3VsYXItZXNsaW50L2RpcmVjdGl2ZS1zZWxlY3RvclxyXG5ARGlyZWN0aXZlKHsgc2VsZWN0b3I6ICdbbmctZm9vdGVyLXRtcF0nIH0pXHJcbmV4cG9ydCBjbGFzcyBOZ0Zvb3RlclRlbXBsYXRlRGlyZWN0aXZlIHtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB0ZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PikgeyB9XHJcbn1cclxuXHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAYW5ndWxhci1lc2xpbnQvZGlyZWN0aXZlLXNlbGVjdG9yXHJcbkBEaXJlY3RpdmUoeyBzZWxlY3RvcjogJ1tuZy1ub3Rmb3VuZC10bXBdJyB9KVxyXG5leHBvcnQgY2xhc3MgTmdOb3RGb3VuZFRlbXBsYXRlRGlyZWN0aXZlIHtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB0ZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PikgeyB9XHJcbn1cclxuXHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAYW5ndWxhci1lc2xpbnQvZGlyZWN0aXZlLXNlbGVjdG9yXHJcbkBEaXJlY3RpdmUoeyBzZWxlY3RvcjogJ1tuZy10eXBldG9zZWFyY2gtdG1wXScgfSlcclxuZXhwb3J0IGNsYXNzIE5nVHlwZVRvU2VhcmNoVGVtcGxhdGVEaXJlY3RpdmUge1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+KSB7IH1cclxufVxyXG5cclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEBhbmd1bGFyLWVzbGludC9kaXJlY3RpdmUtc2VsZWN0b3JcclxuQERpcmVjdGl2ZSh7IHNlbGVjdG9yOiAnW25nLWxvYWRpbmd0ZXh0LXRtcF0nIH0pXHJcbmV4cG9ydCBjbGFzcyBOZ0xvYWRpbmdUZXh0VGVtcGxhdGVEaXJlY3RpdmUge1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+KSB7IH1cclxufVxyXG5cclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEBhbmd1bGFyLWVzbGludC9kaXJlY3RpdmUtc2VsZWN0b3JcclxuQERpcmVjdGl2ZSh7IHNlbGVjdG9yOiAnW25nLXRhZy10bXBdJyB9KVxyXG5leHBvcnQgY2xhc3MgTmdUYWdUZW1wbGF0ZURpcmVjdGl2ZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4pIHsgfVxyXG59XHJcblxyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQGFuZ3VsYXItZXNsaW50L2RpcmVjdGl2ZS1zZWxlY3RvclxyXG5ARGlyZWN0aXZlKHsgc2VsZWN0b3I6ICdbbmctbG9hZGluZ3NwaW5uZXItdG1wXScgfSlcclxuZXhwb3J0IGNsYXNzIE5nTG9hZGluZ1NwaW5uZXJUZW1wbGF0ZURpcmVjdGl2ZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4pIHsgfVxyXG59XHJcbiJdfQ==