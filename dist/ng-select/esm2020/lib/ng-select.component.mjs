import { Component, forwardRef, Input, Output, EventEmitter, ContentChild, TemplateRef, ViewEncapsulation, HostListener, HostBinding, ViewChild, ChangeDetectionStrategy, Inject, ContentChildren, InjectionToken, Attribute } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { takeUntil, startWith, tap, debounceTime, map, filter } from 'rxjs/operators';
import { Subject, merge } from 'rxjs';
import { NgOptionTemplateDirective, NgLabelTemplateDirective, NgHeaderTemplateDirective, NgFooterTemplateDirective, NgOptgroupTemplateDirective, NgNotFoundTemplateDirective, NgTypeToSearchTemplateDirective, NgLoadingTextTemplateDirective, NgMultiLabelTemplateDirective, NgTagTemplateDirective, NgLoadingSpinnerTemplateDirective } from './ng-templates.directive';
import { isDefined, isFunction, isPromise, isObject } from './value-utils';
import { ItemsList } from './items-list';
import { KeyCode } from './ng-select.types';
import { newId } from './id';
import { NgDropdownPanelComponent } from './ng-dropdown-panel.component';
import { NgOptionComponent } from './ng-option.component';
import { NgDropdownPanelService } from './ng-dropdown-panel.service';
import * as i0 from "@angular/core";
import * as i1 from "./config.service";
import * as i2 from "./console.service";
import * as i3 from "./ng-dropdown-panel.component";
import * as i4 from "@angular/common";
import * as i5 from "./ng-templates.directive";
export const SELECTION_MODEL_FACTORY = new InjectionToken('ng-select-selection-model');
export class NgSelectComponent {
    constructor(classes, autoFocus, config, newSelectionModel, _elementRef, _cd, _console) {
        this.classes = classes;
        this.autoFocus = autoFocus;
        this.config = config;
        this._cd = _cd;
        this._console = _console;
        this.markFirst = true;
        this.dropdownPosition = 'auto';
        this.loading = false;
        this.closeOnSelect = true;
        this.hideSelected = false;
        this.selectOnTab = false;
        this.bufferAmount = 4;
        this.selectableGroup = false;
        this.selectableGroupAsModel = true;
        this.searchFn = null;
        this.trackByFn = null;
        this.clearOnBackspace = true;
        this.labelForId = null;
        this.inputAttrs = {};
        this.readonly = false;
        this.searchWhileComposing = true;
        this.minTermLength = 0;
        this.editableSearchTerm = false;
        this.keyDownFn = (_) => true;
        this.multiple = false;
        this.addTag = false;
        this.searchable = true;
        this.clearable = true;
        this.isOpen = false;
        // output events
        this.blurEvent = new EventEmitter();
        this.focusEvent = new EventEmitter();
        this.changeEvent = new EventEmitter();
        this.openEvent = new EventEmitter();
        this.closeEvent = new EventEmitter();
        this.searchEvent = new EventEmitter();
        this.clearEvent = new EventEmitter();
        this.addEvent = new EventEmitter();
        this.removeEvent = new EventEmitter();
        this.scroll = new EventEmitter();
        this.scrollToEnd = new EventEmitter();
        this.useDefaultClass = true;
        this.viewPortItems = [];
        this.searchTerm = null;
        this.dropdownId = newId();
        this.escapeHTML = true;
        this._items = [];
        this._defaultLabel = 'label';
        this._pressedKeys = [];
        this._isComposing = false;
        this._destroy$ = new Subject();
        this._keyPress$ = new Subject();
        this._onChange = (_) => { };
        this._onTouched = () => { };
        this.clearItem = (item) => {
            const option = this.selectedItems.find(x => x.value === item);
            this.unselect(option);
        };
        this.trackByOption = (_, item) => {
            if (this.trackByFn) {
                return this.trackByFn(item.value);
            }
            return item;
        };
        this._mergeGlobalConfig(config);
        this.itemsList = new ItemsList(this, newSelectionModel());
        this.element = _elementRef.nativeElement;
    }
    get items() { return this._items; }
    ;
    set items(value) {
        if (value === null) {
            value = [];
        }
        this._itemsAreUsed = true;
        this._items = value;
    }
    ;
    get compareWith() { return this._compareWith; }
    set compareWith(fn) {
        if (fn !== undefined && fn !== null && !isFunction(fn)) {
            throw Error('`compareWith` must be a function.');
        }
        this._compareWith = fn;
    }
    get clearSearchOnAdd() {
        if (isDefined(this._clearSearchOnAdd)) {
            return this._clearSearchOnAdd;
        }
        else if (isDefined(this.config.clearSearchOnAdd)) {
            return this.config.clearSearchOnAdd;
        }
        return this.closeOnSelect;
    }
    ;
    set clearSearchOnAdd(value) {
        this._clearSearchOnAdd = value;
    }
    ;
    get disabled() { return this.readonly || this._disabled; }
    ;
    get filtered() { return (!!this.searchTerm && this.searchable || this._isComposing); }
    ;
    get single() { return !this.multiple; }
    ;
    get _editableSearchTerm() {
        return this.editableSearchTerm && !this.multiple;
    }
    get selectedItems() {
        return this.itemsList.selectedItems;
    }
    get selectedValues() {
        return this.selectedItems.map(x => x.value);
    }
    get hasValue() {
        return this.selectedItems.length > 0;
    }
    get currentPanelPosition() {
        if (this.dropdownPanel) {
            return this.dropdownPanel.currentPosition;
        }
        return undefined;
    }
    ngOnInit() {
        this._handleKeyPresses();
        this._setInputAttributes();
    }
    ngOnChanges(changes) {
        if (changes.multiple) {
            this.itemsList.clearSelected();
        }
        if (changes.items) {
            this._setItems(changes.items.currentValue || []);
        }
        if (changes.isOpen) {
            this._manualOpen = isDefined(changes.isOpen.currentValue);
        }
    }
    ngAfterViewInit() {
        if (!this._itemsAreUsed) {
            this.escapeHTML = false;
            this._setItemsFromNgOptions();
        }
        if (isDefined(this.autoFocus)) {
            this.focus();
        }
    }
    ngOnDestroy() {
        this._destroy$.next();
        this._destroy$.complete();
    }
    handleKeyDown($event) {
        const keyCode = KeyCode[$event.which];
        if (keyCode) {
            if (this.keyDownFn($event) === false) {
                return;
            }
            this.handleKeyCode($event);
        }
        else if ($event.key && $event.key.length === 1) {
            this._keyPress$.next($event.key.toLocaleLowerCase());
        }
    }
    handleKeyCode($event) {
        switch ($event.which) {
            case KeyCode.ArrowDown:
                this._handleArrowDown($event);
                break;
            case KeyCode.ArrowUp:
                this._handleArrowUp($event);
                break;
            case KeyCode.Space:
                this._handleSpace($event);
                break;
            case KeyCode.Enter:
                this._handleEnter($event);
                break;
            case KeyCode.Tab:
                this._handleTab($event);
                break;
            case KeyCode.Esc:
                this.close();
                $event.preventDefault();
                break;
            case KeyCode.Backspace:
                this._handleBackspace();
                break;
        }
    }
    handleMousedown($event) {
        const target = $event.target;
        if (target.tagName !== 'INPUT') {
            $event.preventDefault();
        }
        if (target.classList.contains('ng-clear-wrapper')) {
            this.handleClearClick();
            return;
        }
        if (target.classList.contains('ng-arrow-wrapper')) {
            this.handleArrowClick();
            return;
        }
        if (target.classList.contains('ng-value-icon')) {
            return;
        }
        if (!this.focused) {
            this.focus();
        }
        if (this.searchable) {
            this.open();
        }
        else {
            this.toggle();
        }
    }
    handleArrowClick() {
        if (this.isOpen) {
            this.close();
        }
        else {
            this.open();
        }
    }
    handleClearClick() {
        if (this.hasValue) {
            this.itemsList.clearSelected(true);
            this._updateNgModel();
        }
        this._clearSearch();
        this.focus();
        this.clearEvent.emit();
        this._onSelectionChanged();
    }
    clearModel() {
        if (!this.clearable) {
            return;
        }
        this.itemsList.clearSelected();
        this._updateNgModel();
    }
    writeValue(value) {
        this.itemsList.clearSelected();
        this._handleWriteValue(value);
        this._cd.markForCheck();
    }
    registerOnChange(fn) {
        this._onChange = fn;
    }
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    setDisabledState(state) {
        this._disabled = state;
        this._cd.markForCheck();
    }
    toggle() {
        if (!this.isOpen) {
            this.open();
        }
        else {
            this.close();
        }
    }
    open() {
        if (this.disabled || this.isOpen || this.itemsList.maxItemsSelected || this._manualOpen) {
            return;
        }
        if (!this._isTypeahead && !this.addTag && this.itemsList.noItemsToSelect) {
            return;
        }
        this.isOpen = true;
        this.itemsList.markSelectedOrDefault(this.markFirst);
        this.openEvent.emit();
        if (!this.searchTerm) {
            this.focus();
        }
        this.detectChanges();
    }
    close() {
        if (!this.isOpen || this._manualOpen) {
            return;
        }
        this.isOpen = false;
        this._isComposing = false;
        if (!this._editableSearchTerm) {
            this._clearSearch();
        }
        else {
            this.itemsList.resetFilteredItems();
        }
        this.itemsList.unmarkItem();
        this._onTouched();
        this.closeEvent.emit();
        this._cd.markForCheck();
    }
    toggleItem(item) {
        if (!item || item.disabled || this.disabled) {
            return;
        }
        if (this.multiple && item.selected) {
            this.unselect(item);
        }
        else {
            this.select(item);
        }
        if (this._editableSearchTerm) {
            this._setSearchTermFromItems();
        }
        this._onSelectionChanged();
    }
    select(item) {
        if (!item.selected) {
            this.itemsList.select(item);
            if (this.clearSearchOnAdd && !this._editableSearchTerm) {
                this._clearSearch();
            }
            this._updateNgModel();
            if (this.multiple) {
                this.addEvent.emit(item.value);
            }
        }
        if (this.closeOnSelect || this.itemsList.noItemsToSelect) {
            this.close();
        }
    }
    focus() {
        this.searchInput.nativeElement.focus();
    }
    blur() {
        this.searchInput.nativeElement.blur();
    }
    unselect(item) {
        if (!item) {
            return;
        }
        this.itemsList.unselect(item);
        this.focus();
        this._updateNgModel();
        this.removeEvent.emit(item);
    }
    selectTag() {
        let tag;
        if (isFunction(this.addTag)) {
            tag = this.addTag(this.searchTerm);
        }
        else {
            tag = this._primitive ? this.searchTerm : { [this.bindLabel]: this.searchTerm };
        }
        const handleTag = (item) => this._isTypeahead || !this.isOpen ? this.itemsList.mapItem(item, null) : this.itemsList.addItem(item);
        if (isPromise(tag)) {
            tag.then(item => this.select(handleTag(item))).catch(() => { });
        }
        else if (tag) {
            this.select(handleTag(tag));
        }
    }
    showClear() {
        return this.clearable && (this.hasValue || this.searchTerm) && !this.disabled;
    }
    get showAddTag() {
        if (!this._validTerm) {
            return false;
        }
        const term = this.searchTerm.toLowerCase().trim();
        return this.addTag &&
            (!this.itemsList.filteredItems.some(x => x.label.toLowerCase() === term) &&
                (!this.hideSelected && this.isOpen || !this.selectedItems.some(x => x.label.toLowerCase() === term))) &&
            !this.loading;
    }
    showNoItemsFound() {
        const empty = this.itemsList.filteredItems.length === 0;
        return ((empty && !this._isTypeahead && !this.loading) ||
            (empty && this._isTypeahead && this._validTerm && !this.loading)) &&
            !this.showAddTag;
    }
    showTypeToSearch() {
        const empty = this.itemsList.filteredItems.length === 0;
        return empty && this._isTypeahead && !this._validTerm && !this.loading;
    }
    onCompositionStart() {
        this._isComposing = true;
    }
    onCompositionEnd(term) {
        this._isComposing = false;
        if (this.searchWhileComposing) {
            return;
        }
        this.filter(term);
    }
    filter(term) {
        if (this._isComposing && !this.searchWhileComposing) {
            return;
        }
        this.searchTerm = term;
        if (this._isTypeahead && (this._validTerm || this.minTermLength === 0)) {
            this.typeahead.next(term);
        }
        if (!this._isTypeahead) {
            this.itemsList.filter(this.searchTerm);
            if (this.isOpen) {
                this.itemsList.markSelectedOrDefault(this.markFirst);
            }
        }
        this.searchEvent.emit({ term, items: this.itemsList.filteredItems.map(x => x.value) });
        this.open();
    }
    onInputFocus($event) {
        if (this.focused) {
            return;
        }
        if (this._editableSearchTerm) {
            this._setSearchTermFromItems();
        }
        this.element.classList.add('ng-select-focused');
        this.focusEvent.emit($event);
        this.focused = true;
    }
    onInputBlur($event) {
        this.element.classList.remove('ng-select-focused');
        this.blurEvent.emit($event);
        if (!this.isOpen && !this.disabled) {
            this._onTouched();
        }
        if (this._editableSearchTerm) {
            this._setSearchTermFromItems();
        }
        this.focused = false;
    }
    onItemHover(item) {
        if (item.disabled) {
            return;
        }
        this.itemsList.markItem(item);
    }
    detectChanges() {
        if (!this._cd.destroyed) {
            this._cd.detectChanges();
        }
    }
    _setSearchTermFromItems() {
        const selected = this.selectedItems && this.selectedItems[0];
        this.searchTerm = (selected && selected.label) || null;
    }
    _setItems(items) {
        const firstItem = items[0];
        this.bindLabel = this.bindLabel || this._defaultLabel;
        this._primitive = isDefined(firstItem) ? !isObject(firstItem) : this._primitive || this.bindLabel === this._defaultLabel;
        this.itemsList.setItems(items);
        if (items.length > 0 && this.hasValue) {
            this.itemsList.mapSelectedItems();
        }
        if (this.isOpen && isDefined(this.searchTerm) && !this._isTypeahead) {
            this.itemsList.filter(this.searchTerm);
        }
        if (this._isTypeahead || this.isOpen) {
            this.itemsList.markSelectedOrDefault(this.markFirst);
        }
    }
    _setItemsFromNgOptions() {
        const mapNgOptions = (options) => {
            this.items = options.map(option => ({
                $ngOptionValue: option.value,
                $ngOptionLabel: option.elementRef.nativeElement.innerHTML,
                disabled: option.disabled
            }));
            this.itemsList.setItems(this.items);
            if (this.hasValue) {
                this.itemsList.mapSelectedItems();
            }
            this.detectChanges();
        };
        const handleOptionChange = () => {
            const changedOrDestroyed = merge(this.ngOptions.changes, this._destroy$);
            merge(...this.ngOptions.map(option => option.stateChange$))
                .pipe(takeUntil(changedOrDestroyed))
                .subscribe(option => {
                const item = this.itemsList.findItem(option.value);
                item.disabled = option.disabled;
                item.label = option.label || item.label;
                this._cd.detectChanges();
            });
        };
        this.ngOptions.changes
            .pipe(startWith(this.ngOptions), takeUntil(this._destroy$))
            .subscribe(options => {
            this.bindLabel = this._defaultLabel;
            mapNgOptions(options);
            handleOptionChange();
        });
    }
    _isValidWriteValue(value) {
        if (!isDefined(value) || (this.multiple && value === '') || Array.isArray(value) && value.length === 0) {
            return false;
        }
        const validateBinding = (item) => {
            if (!isDefined(this.compareWith) && isObject(item) && this.bindValue) {
                this._console.warn(`Setting object(${JSON.stringify(item)}) as your model with bindValue is not allowed unless [compareWith] is used.`);
                return false;
            }
            return true;
        };
        if (this.multiple) {
            if (!Array.isArray(value)) {
                this._console.warn('Multiple select ngModel should be array.');
                return false;
            }
            return value.every(item => validateBinding(item));
        }
        else {
            return validateBinding(value);
        }
    }
    _handleWriteValue(ngModel) {
        if (!this._isValidWriteValue(ngModel)) {
            return;
        }
        const select = (val) => {
            let item = this.itemsList.findItem(val);
            if (item) {
                this.itemsList.select(item);
            }
            else {
                const isValObject = isObject(val);
                const isPrimitive = !isValObject && !this.bindValue;
                if ((isValObject || isPrimitive)) {
                    this.itemsList.select(this.itemsList.mapItem(val, null));
                }
                else if (this.bindValue) {
                    item = {
                        [this.bindLabel]: null,
                        [this.bindValue]: val
                    };
                    this.itemsList.select(this.itemsList.mapItem(item, null));
                }
            }
        };
        if (this.multiple) {
            ngModel.forEach(item => select(item));
        }
        else {
            select(ngModel);
        }
    }
    _handleKeyPresses() {
        if (this.searchable) {
            return;
        }
        this._keyPress$
            .pipe(takeUntil(this._destroy$), tap(letter => this._pressedKeys.push(letter)), debounceTime(200), filter(() => this._pressedKeys.length > 0), map(() => this._pressedKeys.join('')))
            .subscribe(term => {
            const item = this.itemsList.findByLabel(term);
            if (item) {
                if (this.isOpen) {
                    this.itemsList.markItem(item);
                    this._scrollToMarked();
                    this._cd.markForCheck();
                }
                else {
                    this.select(item);
                }
            }
            this._pressedKeys = [];
        });
    }
    _setInputAttributes() {
        const input = this.searchInput.nativeElement;
        const attributes = {
            type: 'text',
            autocorrect: 'off',
            autocapitalize: 'off',
            autocomplete: this.labelForId ? 'off' : this.dropdownId,
            ...this.inputAttrs
        };
        for (const key of Object.keys(attributes)) {
            input.setAttribute(key, attributes[key]);
        }
    }
    _updateNgModel() {
        const model = [];
        for (const item of this.selectedItems) {
            if (this.bindValue) {
                let value = null;
                if (item.children) {
                    const groupKey = this.groupValue ? this.bindValue : this.groupBy;
                    value = item.value[groupKey || this.groupBy];
                }
                else {
                    value = this.itemsList.resolveNested(item.value, this.bindValue);
                }
                model.push(value);
            }
            else {
                model.push(item.value);
            }
        }
        const selected = this.selectedItems.map(x => x.value);
        if (this.multiple) {
            this._onChange(model);
            this.changeEvent.emit(selected);
        }
        else {
            this._onChange(isDefined(model[0]) ? model[0] : null);
            this.changeEvent.emit(selected[0]);
        }
        this._cd.markForCheck();
    }
    _clearSearch() {
        if (!this.searchTerm) {
            return;
        }
        this._changeSearch(null);
        this.itemsList.resetFilteredItems();
    }
    _changeSearch(searchTerm) {
        this.searchTerm = searchTerm;
        if (this._isTypeahead) {
            this.typeahead.next(searchTerm);
        }
    }
    _scrollToMarked() {
        if (!this.isOpen || !this.dropdownPanel) {
            return;
        }
        this.dropdownPanel.scrollTo(this.itemsList.markedItem);
    }
    _scrollToTag() {
        if (!this.isOpen || !this.dropdownPanel) {
            return;
        }
        this.dropdownPanel.scrollToTag();
    }
    _onSelectionChanged() {
        if (this.isOpen && this.multiple && this.appendTo) {
            // Make sure items are rendered.
            this._cd.detectChanges();
            this.dropdownPanel.adjustPosition();
        }
    }
    _handleTab($event) {
        if (this.isOpen === false && !this.addTag) {
            return;
        }
        if (this.selectOnTab) {
            if (this.itemsList.markedItem) {
                this.toggleItem(this.itemsList.markedItem);
                $event.preventDefault();
            }
            else if (this.showAddTag) {
                this.selectTag();
                $event.preventDefault();
            }
            else {
                this.close();
            }
        }
        else {
            this.close();
        }
    }
    _handleEnter($event) {
        if (this.isOpen || this._manualOpen) {
            if (this.itemsList.markedItem) {
                this.toggleItem(this.itemsList.markedItem);
            }
            else if (this.showAddTag) {
                this.selectTag();
            }
        }
        else if (this.openOnEnter) {
            this.open();
        }
        else {
            return;
        }
        $event.preventDefault();
    }
    _handleSpace($event) {
        if (this.isOpen || this._manualOpen) {
            return;
        }
        this.open();
        $event.preventDefault();
    }
    _handleArrowDown($event) {
        if (this._nextItemIsTag(+1)) {
            this.itemsList.unmarkItem();
            this._scrollToTag();
        }
        else {
            this.itemsList.markNextItem();
            this._scrollToMarked();
        }
        this.open();
        $event.preventDefault();
    }
    _handleArrowUp($event) {
        if (!this.isOpen) {
            return;
        }
        if (this._nextItemIsTag(-1)) {
            this.itemsList.unmarkItem();
            this._scrollToTag();
        }
        else {
            this.itemsList.markPreviousItem();
            this._scrollToMarked();
        }
        $event.preventDefault();
    }
    _nextItemIsTag(nextStep) {
        const nextIndex = this.itemsList.markedIndex + nextStep;
        return this.addTag && this.searchTerm
            && this.itemsList.markedItem
            && (nextIndex < 0 || nextIndex === this.itemsList.filteredItems.length);
    }
    _handleBackspace() {
        if (this.searchTerm || !this.clearable || !this.clearOnBackspace || !this.hasValue) {
            return;
        }
        if (this.multiple) {
            this.unselect(this.itemsList.lastSelectedItem);
        }
        else {
            this.clearModel();
        }
    }
    get _isTypeahead() {
        return this.typeahead && this.typeahead.observers.length > 0;
    }
    get _validTerm() {
        const term = this.searchTerm && this.searchTerm.trim();
        return term && term.length >= this.minTermLength;
    }
    _mergeGlobalConfig(config) {
        this.placeholder = this.placeholder || config.placeholder;
        this.notFoundText = this.notFoundText || config.notFoundText;
        this.typeToSearchText = this.typeToSearchText || config.typeToSearchText;
        this.addTagText = this.addTagText || config.addTagText;
        this.loadingText = this.loadingText || config.loadingText;
        this.clearAllText = this.clearAllText || config.clearAllText;
        this.virtualScroll = isDefined(this.virtualScroll)
            ? this.virtualScroll
            : isDefined(config.disableVirtualScroll) ? !config.disableVirtualScroll : false;
        this.openOnEnter = isDefined(this.openOnEnter) ? this.openOnEnter : config.openOnEnter;
        this.appendTo = this.appendTo || config.appendTo;
        this.bindValue = this.bindValue || config.bindValue;
        this.bindLabel = this.bindLabel || config.bindLabel;
        this.appearance = this.appearance || config.appearance;
    }
}
NgSelectComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: NgSelectComponent, deps: [{ token: 'class', attribute: true }, { token: 'autofocus', attribute: true }, { token: i1.NgSelectConfig }, { token: SELECTION_MODEL_FACTORY }, { token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i2.ConsoleService }], target: i0.ɵɵFactoryTarget.Component });
NgSelectComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.0", type: NgSelectComponent, selector: "ng-select", inputs: { bindLabel: "bindLabel", bindValue: "bindValue", markFirst: "markFirst", placeholder: "placeholder", notFoundText: "notFoundText", typeToSearchText: "typeToSearchText", addTagText: "addTagText", loadingText: "loadingText", clearAllText: "clearAllText", appearance: "appearance", dropdownPosition: "dropdownPosition", appendTo: "appendTo", loading: "loading", closeOnSelect: "closeOnSelect", hideSelected: "hideSelected", selectOnTab: "selectOnTab", openOnEnter: "openOnEnter", maxSelectedItems: "maxSelectedItems", groupBy: "groupBy", groupValue: "groupValue", bufferAmount: "bufferAmount", virtualScroll: "virtualScroll", selectableGroup: "selectableGroup", selectableGroupAsModel: "selectableGroupAsModel", searchFn: "searchFn", trackByFn: "trackByFn", clearOnBackspace: "clearOnBackspace", labelForId: "labelForId", inputAttrs: "inputAttrs", tabIndex: "tabIndex", readonly: "readonly", searchWhileComposing: "searchWhileComposing", minTermLength: "minTermLength", editableSearchTerm: "editableSearchTerm", keyDownFn: "keyDownFn", typeahead: "typeahead", multiple: "multiple", addTag: "addTag", searchable: "searchable", clearable: "clearable", isOpen: "isOpen", items: "items", compareWith: "compareWith", clearSearchOnAdd: "clearSearchOnAdd" }, outputs: { blurEvent: "blur", focusEvent: "focus", changeEvent: "change", openEvent: "open", closeEvent: "close", searchEvent: "search", clearEvent: "clear", addEvent: "add", removeEvent: "remove", scroll: "scroll", scrollToEnd: "scrollToEnd" }, host: { listeners: { "keydown": "handleKeyDown($event)" }, properties: { "class.ng-select-typeahead": "this.typeahead", "class.ng-select-multiple": "this.multiple", "class.ng-select-taggable": "this.addTag", "class.ng-select-searchable": "this.searchable", "class.ng-select-clearable": "this.clearable", "class.ng-select-opened": "this.isOpen", "class.ng-select": "this.useDefaultClass", "class.ng-select-disabled": "this.disabled", "class.ng-select-filtered": "this.filtered", "class.ng-select-single": "this.single" } }, providers: [{
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NgSelectComponent),
            multi: true
        }, NgDropdownPanelService], queries: [{ propertyName: "optionTemplate", first: true, predicate: NgOptionTemplateDirective, descendants: true, read: TemplateRef }, { propertyName: "optgroupTemplate", first: true, predicate: NgOptgroupTemplateDirective, descendants: true, read: TemplateRef }, { propertyName: "labelTemplate", first: true, predicate: NgLabelTemplateDirective, descendants: true, read: TemplateRef }, { propertyName: "multiLabelTemplate", first: true, predicate: NgMultiLabelTemplateDirective, descendants: true, read: TemplateRef }, { propertyName: "headerTemplate", first: true, predicate: NgHeaderTemplateDirective, descendants: true, read: TemplateRef }, { propertyName: "footerTemplate", first: true, predicate: NgFooterTemplateDirective, descendants: true, read: TemplateRef }, { propertyName: "notFoundTemplate", first: true, predicate: NgNotFoundTemplateDirective, descendants: true, read: TemplateRef }, { propertyName: "typeToSearchTemplate", first: true, predicate: NgTypeToSearchTemplateDirective, descendants: true, read: TemplateRef }, { propertyName: "loadingTextTemplate", first: true, predicate: NgLoadingTextTemplateDirective, descendants: true, read: TemplateRef }, { propertyName: "tagTemplate", first: true, predicate: NgTagTemplateDirective, descendants: true, read: TemplateRef }, { propertyName: "loadingSpinnerTemplate", first: true, predicate: NgLoadingSpinnerTemplateDirective, descendants: true, read: TemplateRef }, { propertyName: "ngOptions", predicate: NgOptionComponent, descendants: true }], viewQueries: [{ propertyName: "dropdownPanel", first: true, predicate: NgDropdownPanelComponent, descendants: true }, { propertyName: "searchInput", first: true, predicate: ["searchInput"], descendants: true, static: true }], usesOnChanges: true, ngImport: i0, template: "<div\r\n    (mousedown)=\"handleMousedown($event)\"\r\n    [class.ng-appearance-outline]=\"appearance === 'outline'\"\r\n    [class.ng-has-value]=\"hasValue\"\r\n    class=\"ng-select-container\">\r\n\r\n    <div class=\"ng-value-container\">\r\n        <div class=\"ng-placeholder\">{{placeholder}}</div>\r\n\r\n        <ng-container *ngIf=\"(!multiLabelTemplate  || !multiple ) && selectedItems.length > 0\">\r\n            <div [class.ng-value-disabled]=\"item.disabled\" class=\"ng-value\" *ngFor=\"let item of selectedItems; trackBy: trackByOption\">\r\n                <ng-template #defaultLabelTemplate>\r\n                    <span class=\"ng-value-icon left\" (click)=\"unselect(item);\" aria-hidden=\"true\">\u00D7</span>\r\n                    <span class=\"ng-value-label\" [ngItemLabel]=\"item.label\" [escape]=\"escapeHTML\"></span>\r\n                </ng-template>\r\n\r\n                <ng-template\r\n                    [ngTemplateOutlet]=\"labelTemplate || defaultLabelTemplate\"\r\n                    [ngTemplateOutletContext]=\"{ item: item.value, clear: clearItem, label: item.label }\">\r\n                </ng-template>\r\n            </div>\r\n        </ng-container>\r\n\r\n        <ng-template *ngIf=\"multiple && multiLabelTemplate && selectedValues.length > 0\"\r\n                [ngTemplateOutlet]=\"multiLabelTemplate\"\r\n                [ngTemplateOutletContext]=\"{ items: selectedValues, clear: clearItem }\">\r\n        </ng-template>\r\n\r\n        <div class=\"ng-input\"\r\n            role=\"combobox\" \r\n            [attr.aria-expanded]=\"isOpen\" \r\n            [attr.aria-owns]=\"isOpen ? dropdownId : null\" \r\n            aria-haspopup=\"listbox\">\r\n\r\n            <input #searchInput\r\n                   [attr.id]=\"labelForId\"\r\n                   [attr.tabindex]=\"tabIndex\"\r\n                   [readOnly]=\"!searchable || itemsList.maxItemsSelected\"\r\n                   [disabled]=\"disabled\"\r\n                   [value]=\"searchTerm ? searchTerm : ''\"\r\n                   (input)=\"filter(searchInput.value)\"\r\n                   (compositionstart)=\"onCompositionStart()\"\r\n                   (compositionend)=\"onCompositionEnd(searchInput.value)\"\r\n                   (focus)=\"onInputFocus($event)\"\r\n                   (blur)=\"onInputBlur($event)\"\r\n                   (change)=\"$event.stopPropagation()\"\r\n                   [attr.aria-activedescendant]=\"isOpen ? itemsList?.markedItem?.htmlId : null\"\r\n                   aria-autocomplete=\"list\"\r\n                   [attr.aria-controls]=\"isOpen ? dropdownId : null\">\r\n        </div>\r\n    </div>\r\n\r\n    <ng-container *ngIf=\"loading\">\r\n        <ng-template #defaultLoadingSpinnerTemplate>\r\n            <div class=\"ng-spinner-loader\"></div>\r\n        </ng-template>\r\n\r\n        <ng-template\r\n            [ngTemplateOutlet]=\"loadingSpinnerTemplate || defaultLoadingSpinnerTemplate\">\r\n        </ng-template>\r\n    </ng-container>\r\n\r\n    <span *ngIf=\"showClear()\" class=\"ng-clear-wrapper\" title=\"{{clearAllText}}\">\r\n        <span class=\"ng-clear\" aria-hidden=\"true\">\u00D7</span>\r\n    </span>\r\n\r\n    <span class=\"ng-arrow-wrapper\">\r\n        <span class=\"ng-arrow\"></span>\r\n    </span>\r\n</div>\r\n\r\n<ng-dropdown-panel *ngIf=\"isOpen\"\r\n                   class=\"ng-dropdown-panel\"\r\n                   [virtualScroll]=\"virtualScroll\"\r\n                   [bufferAmount]=\"bufferAmount\"\r\n                   [appendTo]=\"appendTo\"\r\n                   [position]=\"dropdownPosition\"\r\n                   [headerTemplate]=\"headerTemplate\"\r\n                   [footerTemplate]=\"footerTemplate\"\r\n                   [filterValue]=\"searchTerm\"\r\n                   [items]=\"itemsList.filteredItems\"\r\n                   [markedItem]=\"itemsList.markedItem\"\r\n                   (update)=\"viewPortItems = $event\"\r\n                   (scroll)=\"scroll.emit($event)\"\r\n                   (scrollToEnd)=\"scrollToEnd.emit($event)\"\r\n                   (outsideClick)=\"close()\"\r\n                   [class.ng-select-multiple]=\"multiple\"\r\n                   [ngClass]=\"appendTo ? classes : null\"\r\n                   [id]=\"dropdownId\"\r\n                   role=\"listbox\"\r\n                   aria-label=\"Options list\">\r\n\r\n    <ng-container>\r\n        <div class=\"ng-option\" [attr.role]=\"item.children ? 'group' : 'option'\" (click)=\"toggleItem(item)\" (mouseover)=\"onItemHover(item)\"\r\n                *ngFor=\"let item of viewPortItems; trackBy: trackByOption\"\r\n                [class.ng-option-disabled]=\"item.disabled\"\r\n                [class.ng-option-selected]=\"item.selected\"\r\n                [class.ng-optgroup]=\"item.children\"\r\n                [class.ng-option]=\"!item.children\"\r\n                [class.ng-option-child]=\"!!item.parent\"\r\n                [class.ng-option-marked]=\"item === itemsList.markedItem\"\r\n                [attr.aria-selected]=\"item.selected\"\r\n                [attr.id]=\"item?.htmlId\">\r\n\r\n            <ng-template #defaultOptionTemplate>\r\n                <span class=\"ng-option-label\" [ngItemLabel]=\"item.label\" [escape]=\"escapeHTML\"></span>\r\n            </ng-template>\r\n\r\n            <ng-template\r\n                [ngTemplateOutlet]=\"item.children ? (optgroupTemplate || defaultOptionTemplate) : (optionTemplate || defaultOptionTemplate)\"\r\n                [ngTemplateOutletContext]=\"{ item: item.value, item$:item, index: item.index, searchTerm: searchTerm }\">\r\n            </ng-template>\r\n        </div>\r\n\r\n        <div class=\"ng-option\" [class.ng-option-marked]=\"!itemsList.markedItem\" (mouseover)=\"itemsList.unmarkItem()\" role=\"option\" (click)=\"selectTag()\" *ngIf=\"showAddTag\">\r\n            <ng-template #defaultTagTemplate>\r\n                <span><span class=\"ng-tag-label\">{{addTagText}}</span>\"{{searchTerm}}\"</span>\r\n            </ng-template>\r\n\r\n            <ng-template\r\n                [ngTemplateOutlet]=\"tagTemplate || defaultTagTemplate\"\r\n                [ngTemplateOutletContext]=\"{ searchTerm: searchTerm }\">\r\n            </ng-template>\r\n        </div>\r\n    </ng-container>\r\n\r\n    <ng-container *ngIf=\"showNoItemsFound()\">\r\n        <ng-template #defaultNotFoundTemplate>\r\n            <div class=\"ng-option ng-option-disabled\">{{notFoundText}}</div>\r\n        </ng-template>\r\n\r\n        <ng-template\r\n            [ngTemplateOutlet]=\"notFoundTemplate || defaultNotFoundTemplate\"\r\n            [ngTemplateOutletContext]=\"{ searchTerm: searchTerm }\">\r\n        </ng-template>\r\n    </ng-container>\r\n\r\n    <ng-container *ngIf=\"showTypeToSearch()\">\r\n        <ng-template #defaultTypeToSearchTemplate>\r\n            <div class=\"ng-option ng-option-disabled\">{{typeToSearchText}}</div>\r\n        </ng-template>\r\n\r\n        <ng-template\r\n            [ngTemplateOutlet]=\"typeToSearchTemplate || defaultTypeToSearchTemplate\">\r\n        </ng-template>\r\n    </ng-container>\r\n\r\n    <ng-container *ngIf=\"loading && itemsList.filteredItems.length === 0\">\r\n        <ng-template #defaultLoadingTextTemplate>\r\n            <div class=\"ng-option ng-option-disabled\">{{loadingText}}</div>\r\n        </ng-template>\r\n\r\n        <ng-template\r\n            [ngTemplateOutlet]=\"loadingTextTemplate || defaultLoadingTextTemplate\"\r\n            [ngTemplateOutletContext]=\"{ searchTerm: searchTerm }\">\r\n        </ng-template>\r\n    </ng-container>\r\n\r\n</ng-dropdown-panel>\r\n", styles: ["@charset \"UTF-8\";.ng-select{position:relative;display:block;box-sizing:border-box}.ng-select div,.ng-select input,.ng-select span{box-sizing:border-box}.ng-select [hidden]{display:none}.ng-select.ng-select-searchable .ng-select-container .ng-value-container .ng-input{opacity:1}.ng-select.ng-select-opened .ng-select-container{z-index:1001}.ng-select.ng-select-disabled .ng-select-container .ng-value-container .ng-placeholder,.ng-select.ng-select-disabled .ng-select-container .ng-value-container .ng-value{-webkit-user-select:none;user-select:none;cursor:default}.ng-select.ng-select-disabled .ng-arrow-wrapper{cursor:default}.ng-select.ng-select-filtered .ng-placeholder{display:none}.ng-select .ng-select-container{cursor:default;display:flex;outline:none;overflow:hidden;position:relative;width:100%}.ng-select .ng-select-container .ng-value-container{display:flex;flex:1}.ng-select .ng-select-container .ng-value-container .ng-input{opacity:0}.ng-select .ng-select-container .ng-value-container .ng-input>input{box-sizing:content-box;background:none transparent;border:0 none;box-shadow:none;outline:none;padding:0;cursor:default;width:100%}.ng-select .ng-select-container .ng-value-container .ng-input>input::-ms-clear{display:none}.ng-select .ng-select-container .ng-value-container .ng-input>input[readonly]{-webkit-user-select:none;user-select:none;width:0;padding:0}.ng-select.ng-select-single.ng-select-filtered .ng-select-container .ng-value-container .ng-value{visibility:hidden}.ng-select.ng-select-single .ng-select-container .ng-value-container{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ng-select.ng-select-single .ng-select-container .ng-value-container .ng-value{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ng-select.ng-select-single .ng-select-container .ng-value-container .ng-value .ng-value-icon{display:none}.ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{position:absolute;left:0;width:100%}.ng-select.ng-select-multiple.ng-select-disabled>.ng-select-container .ng-value-container .ng-value .ng-value-icon{display:none}.ng-select.ng-select-multiple .ng-select-container .ng-value-container{flex-wrap:wrap}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder{position:absolute}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value{white-space:nowrap}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value.ng-value-disabled .ng-value-icon{display:none}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon{cursor:pointer}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-input{flex:1;z-index:2}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder{z-index:1}.ng-select .ng-clear-wrapper{cursor:pointer;position:relative;width:17px;-webkit-user-select:none;user-select:none}.ng-select .ng-clear-wrapper .ng-clear{display:inline-block;font-size:18px;line-height:1;pointer-events:none}.ng-select .ng-spinner-loader{border-radius:50%;width:17px;height:17px;margin-right:5px;font-size:10px;position:relative;text-indent:-9999em;border-top:2px solid rgba(66,66,66,.2);border-right:2px solid rgba(66,66,66,.2);border-bottom:2px solid rgba(66,66,66,.2);border-left:2px solid #424242;transform:translateZ(0);animation:load8 .8s infinite linear}.ng-select .ng-spinner-loader:after{border-radius:50%;width:17px;height:17px}@keyframes load8{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.ng-select .ng-arrow-wrapper{cursor:pointer;position:relative;text-align:center;-webkit-user-select:none;user-select:none}.ng-select .ng-arrow-wrapper .ng-arrow{pointer-events:none;display:inline-block;height:0;width:0;position:relative}.ng-dropdown-panel{box-sizing:border-box;position:absolute;opacity:0;width:100%;z-index:1050;-webkit-overflow-scrolling:touch}.ng-dropdown-panel .ng-dropdown-panel-items{display:block;height:auto;box-sizing:border-box;max-height:240px;overflow-y:auto}.ng-dropdown-panel .ng-dropdown-panel-items .ng-optgroup{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option{box-sizing:border-box;cursor:pointer;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option .ng-option-label:empty:before{content:\"\\200b\"}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option .highlighted{font-weight:bold;text-decoration:underline}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option.disabled{cursor:default}.ng-dropdown-panel .scroll-host{overflow:hidden;overflow-y:auto;position:relative;display:block;-webkit-overflow-scrolling:touch}.ng-dropdown-panel .scrollable-content{top:0;left:0;width:100%;height:100%;position:absolute}.ng-dropdown-panel .total-padding{width:1px;opacity:0}\n"], components: [{ type: i3.NgDropdownPanelComponent, selector: "ng-dropdown-panel", inputs: ["items", "markedItem", "position", "appendTo", "bufferAmount", "virtualScroll", "headerTemplate", "footerTemplate", "filterValue"], outputs: ["update", "scroll", "scrollToEnd", "outsideClick"] }], directives: [{ type: i4.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i4.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i5.NgItemLabelDirective, selector: "[ngItemLabel]", inputs: ["ngItemLabel", "escape"] }, { type: i4.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }, { type: i4.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0", ngImport: i0, type: NgSelectComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ng-select', providers: [{
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => NgSelectComponent),
                            multi: true
                        }, NgDropdownPanelService], encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, template: "<div\r\n    (mousedown)=\"handleMousedown($event)\"\r\n    [class.ng-appearance-outline]=\"appearance === 'outline'\"\r\n    [class.ng-has-value]=\"hasValue\"\r\n    class=\"ng-select-container\">\r\n\r\n    <div class=\"ng-value-container\">\r\n        <div class=\"ng-placeholder\">{{placeholder}}</div>\r\n\r\n        <ng-container *ngIf=\"(!multiLabelTemplate  || !multiple ) && selectedItems.length > 0\">\r\n            <div [class.ng-value-disabled]=\"item.disabled\" class=\"ng-value\" *ngFor=\"let item of selectedItems; trackBy: trackByOption\">\r\n                <ng-template #defaultLabelTemplate>\r\n                    <span class=\"ng-value-icon left\" (click)=\"unselect(item);\" aria-hidden=\"true\">\u00D7</span>\r\n                    <span class=\"ng-value-label\" [ngItemLabel]=\"item.label\" [escape]=\"escapeHTML\"></span>\r\n                </ng-template>\r\n\r\n                <ng-template\r\n                    [ngTemplateOutlet]=\"labelTemplate || defaultLabelTemplate\"\r\n                    [ngTemplateOutletContext]=\"{ item: item.value, clear: clearItem, label: item.label }\">\r\n                </ng-template>\r\n            </div>\r\n        </ng-container>\r\n\r\n        <ng-template *ngIf=\"multiple && multiLabelTemplate && selectedValues.length > 0\"\r\n                [ngTemplateOutlet]=\"multiLabelTemplate\"\r\n                [ngTemplateOutletContext]=\"{ items: selectedValues, clear: clearItem }\">\r\n        </ng-template>\r\n\r\n        <div class=\"ng-input\"\r\n            role=\"combobox\" \r\n            [attr.aria-expanded]=\"isOpen\" \r\n            [attr.aria-owns]=\"isOpen ? dropdownId : null\" \r\n            aria-haspopup=\"listbox\">\r\n\r\n            <input #searchInput\r\n                   [attr.id]=\"labelForId\"\r\n                   [attr.tabindex]=\"tabIndex\"\r\n                   [readOnly]=\"!searchable || itemsList.maxItemsSelected\"\r\n                   [disabled]=\"disabled\"\r\n                   [value]=\"searchTerm ? searchTerm : ''\"\r\n                   (input)=\"filter(searchInput.value)\"\r\n                   (compositionstart)=\"onCompositionStart()\"\r\n                   (compositionend)=\"onCompositionEnd(searchInput.value)\"\r\n                   (focus)=\"onInputFocus($event)\"\r\n                   (blur)=\"onInputBlur($event)\"\r\n                   (change)=\"$event.stopPropagation()\"\r\n                   [attr.aria-activedescendant]=\"isOpen ? itemsList?.markedItem?.htmlId : null\"\r\n                   aria-autocomplete=\"list\"\r\n                   [attr.aria-controls]=\"isOpen ? dropdownId : null\">\r\n        </div>\r\n    </div>\r\n\r\n    <ng-container *ngIf=\"loading\">\r\n        <ng-template #defaultLoadingSpinnerTemplate>\r\n            <div class=\"ng-spinner-loader\"></div>\r\n        </ng-template>\r\n\r\n        <ng-template\r\n            [ngTemplateOutlet]=\"loadingSpinnerTemplate || defaultLoadingSpinnerTemplate\">\r\n        </ng-template>\r\n    </ng-container>\r\n\r\n    <span *ngIf=\"showClear()\" class=\"ng-clear-wrapper\" title=\"{{clearAllText}}\">\r\n        <span class=\"ng-clear\" aria-hidden=\"true\">\u00D7</span>\r\n    </span>\r\n\r\n    <span class=\"ng-arrow-wrapper\">\r\n        <span class=\"ng-arrow\"></span>\r\n    </span>\r\n</div>\r\n\r\n<ng-dropdown-panel *ngIf=\"isOpen\"\r\n                   class=\"ng-dropdown-panel\"\r\n                   [virtualScroll]=\"virtualScroll\"\r\n                   [bufferAmount]=\"bufferAmount\"\r\n                   [appendTo]=\"appendTo\"\r\n                   [position]=\"dropdownPosition\"\r\n                   [headerTemplate]=\"headerTemplate\"\r\n                   [footerTemplate]=\"footerTemplate\"\r\n                   [filterValue]=\"searchTerm\"\r\n                   [items]=\"itemsList.filteredItems\"\r\n                   [markedItem]=\"itemsList.markedItem\"\r\n                   (update)=\"viewPortItems = $event\"\r\n                   (scroll)=\"scroll.emit($event)\"\r\n                   (scrollToEnd)=\"scrollToEnd.emit($event)\"\r\n                   (outsideClick)=\"close()\"\r\n                   [class.ng-select-multiple]=\"multiple\"\r\n                   [ngClass]=\"appendTo ? classes : null\"\r\n                   [id]=\"dropdownId\"\r\n                   role=\"listbox\"\r\n                   aria-label=\"Options list\">\r\n\r\n    <ng-container>\r\n        <div class=\"ng-option\" [attr.role]=\"item.children ? 'group' : 'option'\" (click)=\"toggleItem(item)\" (mouseover)=\"onItemHover(item)\"\r\n                *ngFor=\"let item of viewPortItems; trackBy: trackByOption\"\r\n                [class.ng-option-disabled]=\"item.disabled\"\r\n                [class.ng-option-selected]=\"item.selected\"\r\n                [class.ng-optgroup]=\"item.children\"\r\n                [class.ng-option]=\"!item.children\"\r\n                [class.ng-option-child]=\"!!item.parent\"\r\n                [class.ng-option-marked]=\"item === itemsList.markedItem\"\r\n                [attr.aria-selected]=\"item.selected\"\r\n                [attr.id]=\"item?.htmlId\">\r\n\r\n            <ng-template #defaultOptionTemplate>\r\n                <span class=\"ng-option-label\" [ngItemLabel]=\"item.label\" [escape]=\"escapeHTML\"></span>\r\n            </ng-template>\r\n\r\n            <ng-template\r\n                [ngTemplateOutlet]=\"item.children ? (optgroupTemplate || defaultOptionTemplate) : (optionTemplate || defaultOptionTemplate)\"\r\n                [ngTemplateOutletContext]=\"{ item: item.value, item$:item, index: item.index, searchTerm: searchTerm }\">\r\n            </ng-template>\r\n        </div>\r\n\r\n        <div class=\"ng-option\" [class.ng-option-marked]=\"!itemsList.markedItem\" (mouseover)=\"itemsList.unmarkItem()\" role=\"option\" (click)=\"selectTag()\" *ngIf=\"showAddTag\">\r\n            <ng-template #defaultTagTemplate>\r\n                <span><span class=\"ng-tag-label\">{{addTagText}}</span>\"{{searchTerm}}\"</span>\r\n            </ng-template>\r\n\r\n            <ng-template\r\n                [ngTemplateOutlet]=\"tagTemplate || defaultTagTemplate\"\r\n                [ngTemplateOutletContext]=\"{ searchTerm: searchTerm }\">\r\n            </ng-template>\r\n        </div>\r\n    </ng-container>\r\n\r\n    <ng-container *ngIf=\"showNoItemsFound()\">\r\n        <ng-template #defaultNotFoundTemplate>\r\n            <div class=\"ng-option ng-option-disabled\">{{notFoundText}}</div>\r\n        </ng-template>\r\n\r\n        <ng-template\r\n            [ngTemplateOutlet]=\"notFoundTemplate || defaultNotFoundTemplate\"\r\n            [ngTemplateOutletContext]=\"{ searchTerm: searchTerm }\">\r\n        </ng-template>\r\n    </ng-container>\r\n\r\n    <ng-container *ngIf=\"showTypeToSearch()\">\r\n        <ng-template #defaultTypeToSearchTemplate>\r\n            <div class=\"ng-option ng-option-disabled\">{{typeToSearchText}}</div>\r\n        </ng-template>\r\n\r\n        <ng-template\r\n            [ngTemplateOutlet]=\"typeToSearchTemplate || defaultTypeToSearchTemplate\">\r\n        </ng-template>\r\n    </ng-container>\r\n\r\n    <ng-container *ngIf=\"loading && itemsList.filteredItems.length === 0\">\r\n        <ng-template #defaultLoadingTextTemplate>\r\n            <div class=\"ng-option ng-option-disabled\">{{loadingText}}</div>\r\n        </ng-template>\r\n\r\n        <ng-template\r\n            [ngTemplateOutlet]=\"loadingTextTemplate || defaultLoadingTextTemplate\"\r\n            [ngTemplateOutletContext]=\"{ searchTerm: searchTerm }\">\r\n        </ng-template>\r\n    </ng-container>\r\n\r\n</ng-dropdown-panel>\r\n", styles: ["@charset \"UTF-8\";.ng-select{position:relative;display:block;box-sizing:border-box}.ng-select div,.ng-select input,.ng-select span{box-sizing:border-box}.ng-select [hidden]{display:none}.ng-select.ng-select-searchable .ng-select-container .ng-value-container .ng-input{opacity:1}.ng-select.ng-select-opened .ng-select-container{z-index:1001}.ng-select.ng-select-disabled .ng-select-container .ng-value-container .ng-placeholder,.ng-select.ng-select-disabled .ng-select-container .ng-value-container .ng-value{-webkit-user-select:none;user-select:none;cursor:default}.ng-select.ng-select-disabled .ng-arrow-wrapper{cursor:default}.ng-select.ng-select-filtered .ng-placeholder{display:none}.ng-select .ng-select-container{cursor:default;display:flex;outline:none;overflow:hidden;position:relative;width:100%}.ng-select .ng-select-container .ng-value-container{display:flex;flex:1}.ng-select .ng-select-container .ng-value-container .ng-input{opacity:0}.ng-select .ng-select-container .ng-value-container .ng-input>input{box-sizing:content-box;background:none transparent;border:0 none;box-shadow:none;outline:none;padding:0;cursor:default;width:100%}.ng-select .ng-select-container .ng-value-container .ng-input>input::-ms-clear{display:none}.ng-select .ng-select-container .ng-value-container .ng-input>input[readonly]{-webkit-user-select:none;user-select:none;width:0;padding:0}.ng-select.ng-select-single.ng-select-filtered .ng-select-container .ng-value-container .ng-value{visibility:hidden}.ng-select.ng-select-single .ng-select-container .ng-value-container{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ng-select.ng-select-single .ng-select-container .ng-value-container .ng-value{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ng-select.ng-select-single .ng-select-container .ng-value-container .ng-value .ng-value-icon{display:none}.ng-select.ng-select-single .ng-select-container .ng-value-container .ng-input{position:absolute;left:0;width:100%}.ng-select.ng-select-multiple.ng-select-disabled>.ng-select-container .ng-value-container .ng-value .ng-value-icon{display:none}.ng-select.ng-select-multiple .ng-select-container .ng-value-container{flex-wrap:wrap}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder{position:absolute}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value{white-space:nowrap}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value.ng-value-disabled .ng-value-icon{display:none}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value .ng-value-icon{cursor:pointer}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-input{flex:1;z-index:2}.ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder{z-index:1}.ng-select .ng-clear-wrapper{cursor:pointer;position:relative;width:17px;-webkit-user-select:none;user-select:none}.ng-select .ng-clear-wrapper .ng-clear{display:inline-block;font-size:18px;line-height:1;pointer-events:none}.ng-select .ng-spinner-loader{border-radius:50%;width:17px;height:17px;margin-right:5px;font-size:10px;position:relative;text-indent:-9999em;border-top:2px solid rgba(66,66,66,.2);border-right:2px solid rgba(66,66,66,.2);border-bottom:2px solid rgba(66,66,66,.2);border-left:2px solid #424242;transform:translateZ(0);animation:load8 .8s infinite linear}.ng-select .ng-spinner-loader:after{border-radius:50%;width:17px;height:17px}@keyframes load8{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.ng-select .ng-arrow-wrapper{cursor:pointer;position:relative;text-align:center;-webkit-user-select:none;user-select:none}.ng-select .ng-arrow-wrapper .ng-arrow{pointer-events:none;display:inline-block;height:0;width:0;position:relative}.ng-dropdown-panel{box-sizing:border-box;position:absolute;opacity:0;width:100%;z-index:1050;-webkit-overflow-scrolling:touch}.ng-dropdown-panel .ng-dropdown-panel-items{display:block;height:auto;box-sizing:border-box;max-height:240px;overflow-y:auto}.ng-dropdown-panel .ng-dropdown-panel-items .ng-optgroup{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option{box-sizing:border-box;cursor:pointer;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option .ng-option-label:empty:before{content:\"\\200b\"}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option .highlighted{font-weight:bold;text-decoration:underline}.ng-dropdown-panel .ng-dropdown-panel-items .ng-option.disabled{cursor:default}.ng-dropdown-panel .scroll-host{overflow:hidden;overflow-y:auto;position:relative;display:block;-webkit-overflow-scrolling:touch}.ng-dropdown-panel .scrollable-content{top:0;left:0;width:100%;height:100%;position:absolute}.ng-dropdown-panel .total-padding{width:1px;opacity:0}\n"] }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Attribute,
                    args: ['class']
                }] }, { type: undefined, decorators: [{
                    type: Attribute,
                    args: ['autofocus']
                }] }, { type: i1.NgSelectConfig }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [SELECTION_MODEL_FACTORY]
                }] }, { type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i2.ConsoleService }]; }, propDecorators: { bindLabel: [{
                type: Input
            }], bindValue: [{
                type: Input
            }], markFirst: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], notFoundText: [{
                type: Input
            }], typeToSearchText: [{
                type: Input
            }], addTagText: [{
                type: Input
            }], loadingText: [{
                type: Input
            }], clearAllText: [{
                type: Input
            }], appearance: [{
                type: Input
            }], dropdownPosition: [{
                type: Input
            }], appendTo: [{
                type: Input
            }], loading: [{
                type: Input
            }], closeOnSelect: [{
                type: Input
            }], hideSelected: [{
                type: Input
            }], selectOnTab: [{
                type: Input
            }], openOnEnter: [{
                type: Input
            }], maxSelectedItems: [{
                type: Input
            }], groupBy: [{
                type: Input
            }], groupValue: [{
                type: Input
            }], bufferAmount: [{
                type: Input
            }], virtualScroll: [{
                type: Input
            }], selectableGroup: [{
                type: Input
            }], selectableGroupAsModel: [{
                type: Input
            }], searchFn: [{
                type: Input
            }], trackByFn: [{
                type: Input
            }], clearOnBackspace: [{
                type: Input
            }], labelForId: [{
                type: Input
            }], inputAttrs: [{
                type: Input
            }], tabIndex: [{
                type: Input
            }], readonly: [{
                type: Input
            }], searchWhileComposing: [{
                type: Input
            }], minTermLength: [{
                type: Input
            }], editableSearchTerm: [{
                type: Input
            }], keyDownFn: [{
                type: Input
            }], typeahead: [{
                type: Input
            }, {
                type: HostBinding,
                args: ['class.ng-select-typeahead']
            }], multiple: [{
                type: Input
            }, {
                type: HostBinding,
                args: ['class.ng-select-multiple']
            }], addTag: [{
                type: Input
            }, {
                type: HostBinding,
                args: ['class.ng-select-taggable']
            }], searchable: [{
                type: Input
            }, {
                type: HostBinding,
                args: ['class.ng-select-searchable']
            }], clearable: [{
                type: Input
            }, {
                type: HostBinding,
                args: ['class.ng-select-clearable']
            }], isOpen: [{
                type: Input
            }, {
                type: HostBinding,
                args: ['class.ng-select-opened']
            }], items: [{
                type: Input
            }], compareWith: [{
                type: Input
            }], clearSearchOnAdd: [{
                type: Input
            }], blurEvent: [{
                type: Output,
                args: ['blur']
            }], focusEvent: [{
                type: Output,
                args: ['focus']
            }], changeEvent: [{
                type: Output,
                args: ['change']
            }], openEvent: [{
                type: Output,
                args: ['open']
            }], closeEvent: [{
                type: Output,
                args: ['close']
            }], searchEvent: [{
                type: Output,
                args: ['search']
            }], clearEvent: [{
                type: Output,
                args: ['clear']
            }], addEvent: [{
                type: Output,
                args: ['add']
            }], removeEvent: [{
                type: Output,
                args: ['remove']
            }], scroll: [{
                type: Output,
                args: ['scroll']
            }], scrollToEnd: [{
                type: Output,
                args: ['scrollToEnd']
            }], optionTemplate: [{
                type: ContentChild,
                args: [NgOptionTemplateDirective, { read: TemplateRef }]
            }], optgroupTemplate: [{
                type: ContentChild,
                args: [NgOptgroupTemplateDirective, { read: TemplateRef }]
            }], labelTemplate: [{
                type: ContentChild,
                args: [NgLabelTemplateDirective, { read: TemplateRef }]
            }], multiLabelTemplate: [{
                type: ContentChild,
                args: [NgMultiLabelTemplateDirective, { read: TemplateRef }]
            }], headerTemplate: [{
                type: ContentChild,
                args: [NgHeaderTemplateDirective, { read: TemplateRef }]
            }], footerTemplate: [{
                type: ContentChild,
                args: [NgFooterTemplateDirective, { read: TemplateRef }]
            }], notFoundTemplate: [{
                type: ContentChild,
                args: [NgNotFoundTemplateDirective, { read: TemplateRef }]
            }], typeToSearchTemplate: [{
                type: ContentChild,
                args: [NgTypeToSearchTemplateDirective, { read: TemplateRef }]
            }], loadingTextTemplate: [{
                type: ContentChild,
                args: [NgLoadingTextTemplateDirective, { read: TemplateRef }]
            }], tagTemplate: [{
                type: ContentChild,
                args: [NgTagTemplateDirective, { read: TemplateRef }]
            }], loadingSpinnerTemplate: [{
                type: ContentChild,
                args: [NgLoadingSpinnerTemplateDirective, { read: TemplateRef }]
            }], dropdownPanel: [{
                type: ViewChild,
                args: [forwardRef(() => NgDropdownPanelComponent)]
            }], searchInput: [{
                type: ViewChild,
                args: ['searchInput', { static: true }]
            }], ngOptions: [{
                type: ContentChildren,
                args: [NgOptionComponent, { descendants: true }]
            }], useDefaultClass: [{
                type: HostBinding,
                args: ['class.ng-select']
            }], disabled: [{
                type: HostBinding,
                args: ['class.ng-select-disabled']
            }], filtered: [{
                type: HostBinding,
                args: ['class.ng-select-filtered']
            }], single: [{
                type: HostBinding,
                args: ['class.ng-select-single']
            }], handleKeyDown: [{
                type: HostListener,
                args: ['keydown', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctc2VsZWN0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9uZy1zZWxlY3QvbGliL25nLXNlbGVjdC5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9zcmMvbmctc2VsZWN0L2xpYi9uZy1zZWxlY3QuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNILFNBQVMsRUFLVCxVQUFVLEVBRVYsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBQ1osWUFBWSxFQUNaLFdBQVcsRUFDWCxpQkFBaUIsRUFDakIsWUFBWSxFQUNaLFdBQVcsRUFDWCxTQUFTLEVBRVQsdUJBQXVCLEVBQ3ZCLE1BQU0sRUFFTixlQUFlLEVBRWYsY0FBYyxFQUNkLFNBQVMsRUFDWixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQXdCLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDekUsT0FBTyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDdEYsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFdEMsT0FBTyxFQUNILHlCQUF5QixFQUN6Qix3QkFBd0IsRUFDeEIseUJBQXlCLEVBQ3pCLHlCQUF5QixFQUN6QiwyQkFBMkIsRUFDM0IsMkJBQTJCLEVBQzNCLCtCQUErQixFQUMvQiw4QkFBOEIsRUFDOUIsNkJBQTZCLEVBQzdCLHNCQUFzQixFQUN0QixpQ0FBaUMsRUFDcEMsTUFBTSwwQkFBMEIsQ0FBQztBQUdsQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDekMsT0FBTyxFQUFZLE9B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d0JBQXdCLENBQUM7Z0JBQ1QsV0FBVztzQkFBdEQsU0FBUzt1QkFBQyxhQUFhLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFO2dCQUNpQixTQUFTO3NCQUFuRSxlQUFlO3VCQUFDLGlCQUFpQixFQUFFLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRTtnQkFFekIsZUFBZTtzQkFBOUMsV0FBVzt1QkFBQyxpQkFBaUI7Z0JBRWUsUUFBUTtzQkFBcEQsV0FBVzt1QkFBQywwQkFBMEI7Z0JBRU0sUUFBUTtzQkFBcEQsV0FBVzt1QkFBQywwQkFBMEI7Z0JBRUksTUFBTTtzQkFBaEQsV0FBVzt1QkFBQyx3QkFBd0I7Z0JBc0dyQyxhQUFhO3NCQURaLFlBQVk7dUJBQUMsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICAgIENvbXBvbmVudCxcclxuICAgIE9uQ2hhbmdlcyxcclxuICAgIE9uRGVzdHJveSxcclxuICAgIE9uSW5pdCxcclxuICAgIEFmdGVyVmlld0luaXQsXHJcbiAgICBmb3J3YXJkUmVmLFxyXG4gICAgQ2hhbmdlRGV0ZWN0b3JSZWYsXHJcbiAgICBJbnB1dCxcclxuICAgIE91dHB1dCxcclxuICAgIEV2ZW50RW1pdHRlcixcclxuICAgIENvbnRlbnRDaGlsZCxcclxuICAgIFRlbXBsYXRlUmVmLFxyXG4gICAgVmlld0VuY2Fwc3VsYXRpb24sXHJcbiAgICBIb3N0TGlzdGVuZXIsXHJcbiAgICBIb3N0QmluZGluZyxcclxuICAgIFZpZXdDaGlsZCxcclxuICAgIEVsZW1lbnRSZWYsXHJcbiAgICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcclxuICAgIEluamVjdCxcclxuICAgIFNpbXBsZUNoYW5nZXMsXHJcbiAgICBDb250ZW50Q2hpbGRyZW4sXHJcbiAgICBRdWVyeUxpc3QsXHJcbiAgICBJbmplY3Rpb25Ub2tlbixcclxuICAgIEF0dHJpYnV0ZVxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcbmltcG9ydCB7IHRha2VVbnRpbCwgc3RhcnRXaXRoLCB0YXAsIGRlYm91bmNlVGltZSwgbWFwLCBmaWx0ZXIgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7IFN1YmplY3QsIG1lcmdlIH0gZnJvbSAncnhqcyc7XHJcblxyXG5pbXBvcnQge1xyXG4gICAgTmdPcHRpb25UZW1wbGF0ZURpcmVjdGl2ZSxcclxuICAgIE5nTGFiZWxUZW1wbGF0ZURpcmVjdGl2ZSxcclxuICAgIE5nSGVhZGVyVGVtcGxhdGVEaXJlY3RpdmUsXHJcbiAgICBOZ0Zvb3RlclRlbXBsYXRlRGlyZWN0aXZlLFxyXG4gICAgTmdPcHRncm91cFRlbXBsYXRlRGlyZWN0aXZlLFxyXG4gICAgTmdOb3RGb3VuZFRlbXBsYXRlRGlyZWN0aXZlLFxyXG4gICAgTmdUeXBlVG9TZWFyY2hUZW1wbGF0ZURpcmVjdGl2ZSxcclxuICAgIE5nTG9hZGluZ1RleHRUZW1wbGF0ZURpcmVjdGl2ZSxcclxuICAgIE5nTXVsdGlMYWJlbFRlbXBsYXRlRGlyZWN0aXZlLFxyXG4gICAgTmdUYWdUZW1wbGF0ZURpcmVjdGl2ZSxcclxuICAgIE5nTG9hZGluZ1NwaW5uZXJUZW1wbGF0ZURpcmVjdGl2ZVxyXG59IGZyb20gJy4vbmctdGVtcGxhdGVzLmRpcmVjdGl2ZSc7XHJcblxyXG5pbXBvcnQgeyBDb25zb2xlU2VydmljZSB9IGZyb20gJy4vY29uc29sZS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgaXNEZWZpbmVkLCBpc0Z1bmN0aW9uLCBpc1Byb21pc2UsIGlzT2JqZWN0IH0gZnJvbSAnLi92YWx1ZS11dGlscyc7XHJcbmltcG9ydCB7IEl0ZW1zTGlzdCB9IGZyb20gJy4vaXRlbXMtbGlzdCc7XHJcbmltcG9ydCB7IE5nT3B0aW9uLCBLZXlDb2RlLCBEcm9wZG93blBvc2l0aW9uIH0gZnJvbSAnLi9uZy1zZWxlY3QudHlwZXMnO1xyXG5pbXBvcnQgeyBuZXdJZCB9IGZyb20gJy4vaWQnO1xyXG5pbXBvcnQgeyBOZ0Ryb3Bkb3duUGFuZWxDb21wb25lbnQgfSBmcm9tICcuL25nLWRyb3Bkb3duLXBhbmVsLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IE5nT3B0aW9uQ29tcG9uZW50IH0gZnJvbSAnLi9uZy1vcHRpb24uY29tcG9uZW50JztcclxuaW1wb3J0IHsgU2VsZWN0aW9uTW9kZWxGYWN0b3J5IH0gZnJvbSAnLi9zZWxlY3Rpb24tbW9kZWwnO1xyXG5pbXBvcnQgeyBOZ1NlbGVjdENvbmZpZyB9IGZyb20gJy4vY29uZmlnLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBOZ0Ryb3Bkb3duUGFuZWxTZXJ2aWNlIH0gZnJvbSAnLi9uZy1kcm9wZG93bi1wYW5lbC5zZXJ2aWNlJztcclxuXHJcbmV4cG9ydCBjb25zdCBTRUxFQ1RJT05fTU9ERUxfRkFDVE9SWSA9IG5ldyBJbmplY3Rpb25Ub2tlbjxTZWxlY3Rpb25Nb2RlbEZhY3Rvcnk+KCduZy1zZWxlY3Qtc2VsZWN0aW9uLW1vZGVsJyk7XHJcbmV4cG9ydCB0eXBlIEFkZFRhZ0ZuID0gKCh0ZXJtOiBzdHJpbmcpID0+IGFueSB8IFByb21pc2U8YW55Pik7XHJcbmV4cG9ydCB0eXBlIENvbXBhcmVXaXRoRm4gPSAoYTogYW55LCBiOiBhbnkpID0+IGJvb2xlYW47XHJcbmV4cG9ydCB0eXBlIEdyb3VwVmFsdWVGbiA9IChrZXk6IHN0cmluZyB8IGFueSwgY2hpbGRyZW46IGFueVtdKSA9PiBzdHJpbmcgfCBhbnk7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAnbmctc2VsZWN0JyxcclxuICAgIHRlbXBsYXRlVXJsOiAnLi9uZy1zZWxlY3QuY29tcG9uZW50Lmh0bWwnLFxyXG4gICAgc3R5bGVVcmxzOiBbJy4vbmctc2VsZWN0LmNvbXBvbmVudC5zY3NzJ10sXHJcbiAgICBwcm92aWRlcnM6IFt7XHJcbiAgICAgICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXHJcbiAgICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTmdTZWxlY3RDb21wb25lbnQpLFxyXG4gICAgICAgIG11bHRpOiB0cnVlXHJcbiAgICB9LCBOZ0Ryb3Bkb3duUGFuZWxTZXJ2aWNlXSxcclxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXHJcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcclxufSlcclxuZXhwb3J0IGNsYXNzIE5nU2VsZWN0Q29tcG9uZW50IGltcGxlbWVudHMgT25EZXN0cm95LCBPbkNoYW5nZXMsIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCwgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xyXG5cclxuICAgIEBJbnB1dCgpIGJpbmRMYWJlbDogc3RyaW5nO1xyXG4gICAgQElucHV0KCkgYmluZFZhbHVlOiBzdHJpbmc7XHJcbiAgICBASW5wdXQoKSBtYXJrRmlyc3QgPSB0cnVlO1xyXG4gICAgQElucHV0KCkgcGxhY2Vob2xkZXI6IHN0cmluZztcclxuICAgIEBJbnB1dCgpIG5vdEZvdW5kVGV4dDogc3RyaW5nO1xyXG4gICAgQElucHV0KCkgdHlwZVRvU2VhcmNoVGV4dDogc3RyaW5nO1xyXG4gICAgQElucHV0KCkgYWRkVGFnVGV4dDogc3RyaW5nO1xyXG4gICAgQElucHV0KCkgbG9hZGluZ1RleHQ6IHN0cmluZztcclxuICAgIEBJbnB1dCgpIGNsZWFyQWxsVGV4dDogc3RyaW5nO1xyXG4gICAgQElucHV0KCkgYXBwZWFyYW5jZTogc3RyaW5nO1xyXG4gICAgQElucHV0KCkgZHJvcGRvd25Qb3NpdGlvbjogRHJvcGRvd25Qb3NpdGlvbiA9ICdhdXRvJztcclxuICAgIEBJbnB1dCgpIGFwcGVuZFRvOiBzdHJpbmc7XHJcbiAgICBASW5wdXQoKSBsb2FkaW5nID0gZmFsc2U7XHJcbiAgICBASW5wdXQoKSBjbG9zZU9uU2VsZWN0ID0gdHJ1ZTtcclxuICAgIEBJbnB1dCgpIGhpZGVTZWxlY3RlZCA9IGZhbHNlO1xyXG4gICAgQElucHV0KCkgc2VsZWN0T25UYWIgPSBmYWxzZTtcclxuICAgIEBJbnB1dCgpIG9wZW5PbkVudGVyOiBib29sZWFuO1xyXG4gICAgQElucHV0KCkgbWF4U2VsZWN0ZWRJdGVtczogbnVtYmVyO1xyXG4gICAgQElucHV0KCkgZ3JvdXBCeTogc3RyaW5nIHwgKCh2YWx1ZTogYW55KSA9PiBhbnkpO1xyXG4gICAgQElucHV0KCkgZ3JvdXBWYWx1ZTogR3JvdXBWYWx1ZUZuO1xyXG4gICAgQElucHV0KCkgYnVmZmVyQW1vdW50ID0gNDtcclxuICAgIEBJbnB1dCgpIHZpcnR1YWxTY3JvbGw6IGJvb2xlYW47XHJcbiAgICBASW5wdXQoKSBzZWxlY3RhYmxlR3JvdXAgPSBmYWxzZTtcclxuICAgIEBJbnB1dCgpIHNlbGVjdGFibGVHcm91cEFzTW9kZWwgPSB0cnVlO1xyXG4gICAgQElucHV0KCkgc2VhcmNoRm4gPSBudWxsO1xyXG4gICAgQElucHV0KCkgdHJhY2tCeUZuID0gbnVsbDtcclxuICAgIEBJbnB1dCgpIGNsZWFyT25CYWNrc3BhY2UgPSB0cnVlO1xyXG4gICAgQElucHV0KCkgbGFiZWxGb3JJZCA9IG51bGw7XHJcbiAgICBASW5wdXQoKSBpbnB1dEF0dHJzOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9ID0ge307XHJcbiAgICBASW5wdXQoKSB0YWJJbmRleDogbnVtYmVyO1xyXG4gICAgQElucHV0KCkgcmVhZG9ubHkgPSBmYWxzZTtcclxuICAgIEBJbnB1dCgpIHNlYXJjaFdoaWxlQ29tcG9zaW5nID0gdHJ1ZTtcclxuICAgIEBJbnB1dCgpIG1pblRlcm1MZW5ndGggPSAwO1xyXG4gICAgQElucHV0KCkgZWRpdGFibGVTZWFyY2hUZXJtID0gZmFsc2U7XHJcbiAgICBASW5wdXQoKSBrZXlEb3duRm4gPSAoXzogS2V5Ym9hcmRFdmVudCkgPT4gdHJ1ZTtcclxuXHJcbiAgICBASW5wdXQoKSBASG9zdEJpbmRpbmcoJ2NsYXNzLm5nLXNlbGVjdC10eXBlYWhlYWQnKSB0eXBlYWhlYWQ6IFN1YmplY3Q8c3RyaW5nPjtcclxuICAgIEBJbnB1dCgpIEBIb3N0QmluZGluZygnY2xhc3Mubmctc2VsZWN0LW11bHRpcGxlJykgbXVsdGlwbGUgPSBmYWxzZTtcclxuICAgIEBJbnB1dCgpIEBIb3N0QmluZGluZygnY2xhc3Mubmctc2VsZWN0LXRhZ2dhYmxlJykgYWRkVGFnOiBib29sZWFuIHwgQWRkVGFnRm4gPSBmYWxzZTtcclxuICAgIEBJbnB1dCgpIEBIb3N0QmluZGluZygnY2xhc3Mubmctc2VsZWN0LXNlYXJjaGFibGUnKSBzZWFyY2hhYmxlID0gdHJ1ZTtcclxuICAgIEBJbnB1dCgpIEBIb3N0QmluZGluZygnY2xhc3Mubmctc2VsZWN0LWNsZWFyYWJsZScpIGNsZWFyYWJsZSA9IHRydWU7XHJcbiAgICBASW5wdXQoKSBASG9zdEJpbmRpbmcoJ2NsYXNzLm5nLXNlbGVjdC1vcGVuZWQnKSBpc09wZW4gPSBmYWxzZTtcclxuXHJcbiAgICBASW5wdXQoKVxyXG4gICAgZ2V0IGl0ZW1zKCkgeyByZXR1cm4gdGhpcy5faXRlbXMgfTtcclxuXHJcbiAgICBzZXQgaXRlbXModmFsdWU6IGFueVtdIHwgbnVsbCkge1xyXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB2YWx1ZSA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9pdGVtc0FyZVVzZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX2l0ZW1zID0gdmFsdWU7XHJcbiAgICB9O1xyXG5cclxuICAgIEBJbnB1dCgpXHJcbiAgICBnZXQgY29tcGFyZVdpdGgoKSB7IHJldHVybiB0aGlzLl9jb21wYXJlV2l0aDsgfVxyXG5cclxuICAgIHNldCBjb21wYXJlV2l0aChmbjogQ29tcGFyZVdpdGhGbikge1xyXG4gICAgICAgIGlmIChmbiAhPT0gdW5kZWZpbmVkICYmIGZuICE9PSBudWxsICYmICFpc0Z1bmN0aW9uKGZuKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcignYGNvbXBhcmVXaXRoYCBtdXN0IGJlIGEgZnVuY3Rpb24uJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2NvbXBhcmVXaXRoID0gZm47XHJcbiAgICB9XHJcblxyXG4gICAgQElucHV0KClcclxuICAgIGdldCBjbGVhclNlYXJjaE9uQWRkKCkge1xyXG4gICAgICAgIGlmIChpc0RlZmluZWQodGhpcy5fY2xlYXJTZWFyY2hPbkFkZCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NsZWFyU2VhcmNoT25BZGQ7XHJcbiAgICAgICAgfSBlbHNlIGlmIChpc0RlZmluZWQodGhpcy5jb25maWcuY2xlYXJTZWFyY2hPbkFkZCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLmNsZWFyU2VhcmNoT25BZGQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmNsb3NlT25TZWxlY3Q7XHJcbiAgICB9O1xyXG5cclxuICAgIHNldCBjbGVhclNlYXJjaE9uQWRkKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5fY2xlYXJTZWFyY2hPbkFkZCA9IHZhbHVlO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBvdXRwdXQgZXZlbnRzXHJcbiAgICBAT3V0cHV0KCdibHVyJykgYmx1ckV2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgQE91dHB1dCgnZm9jdXMnKSBmb2N1c0V2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgQE91dHB1dCgnY2hhbmdlJykgY2hhbmdlRXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICBAT3V0cHV0KCdvcGVuJykgb3BlbkV2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgQE91dHB1dCgnY2xvc2UnKSBjbG9zZUV2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgQE91dHB1dCgnc2VhcmNoJykgc2VhcmNoRXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyPHsgdGVybTogc3RyaW5nLCBpdGVtczogYW55W10gfT4oKTtcclxuICAgIEBPdXRwdXQoJ2NsZWFyJykgY2xlYXJFdmVudCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIEBPdXRwdXQoJ2FkZCcpIGFkZEV2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgQE91dHB1dCgncmVtb3ZlJykgcmVtb3ZlRXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICBAT3V0cHV0KCdzY3JvbGwnKSBzY3JvbGwgPSBuZXcgRXZlbnRFbWl0dGVyPHsgc3RhcnQ6IG51bWJlcjsgZW5kOiBudW1iZXIgfT4oKTtcclxuICAgIEBPdXRwdXQoJ3Njcm9sbFRvRW5kJykgc2Nyb2xsVG9FbmQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gICAgLy8gY3VzdG9tIHRlbXBsYXRlc1xyXG4gICAgQENvbnRlbnRDaGlsZChOZ09wdGlvblRlbXBsYXRlRGlyZWN0aXZlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmIH0pIG9wdGlvblRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG4gICAgQENvbnRlbnRDaGlsZChOZ09wdGdyb3VwVGVtcGxhdGVEaXJlY3RpdmUsIHsgcmVhZDogVGVtcGxhdGVSZWYgfSkgb3B0Z3JvdXBUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuICAgIEBDb250ZW50Q2hpbGQoTmdMYWJlbFRlbXBsYXRlRGlyZWN0aXZlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmIH0pIGxhYmVsVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcbiAgICBAQ29udGVudENoaWxkKE5nTXVsdGlMYWJlbFRlbXBsYXRlRGlyZWN0aXZlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmIH0pIG11bHRpTGFiZWxUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuICAgIEBDb250ZW50Q2hpbGQoTmdIZWFkZXJUZW1wbGF0ZURpcmVjdGl2ZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiB9KSBoZWFkZXJUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuICAgIEBDb250ZW50Q2hpbGQoTmdGb290ZXJUZW1wbGF0ZURpcmVjdGl2ZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiB9KSBmb290ZXJUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuICAgIEBDb250ZW50Q2hpbGQoTmdOb3RGb3VuZFRlbXBsYXRlRGlyZWN0aXZlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmIH0pIG5vdEZvdW5kVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcbiAgICBAQ29udGVudENoaWxkKE5nVHlwZVRvU2VhcmNoVGVtcGxhdGVEaXJlY3RpdmUsIHsgcmVhZDogVGVtcGxhdGVSZWYgfSkgdHlwZVRvU2VhcmNoVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcbiAgICBAQ29udGVudENoaWxkKE5nTG9hZGluZ1RleHRUZW1wbGF0ZURpcmVjdGl2ZSwgeyByZWFkOiBUZW1wbGF0ZVJlZiB9KSBsb2FkaW5nVGV4dFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG4gICAgQENvbnRlbnRDaGlsZChOZ1RhZ1RlbXBsYXRlRGlyZWN0aXZlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmIH0pIHRhZ1RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG4gICAgQENvbnRlbnRDaGlsZChOZ0xvYWRpbmdTcGlubmVyVGVtcGxhdGVEaXJlY3RpdmUsIHsgcmVhZDogVGVtcGxhdGVSZWYgfSkgbG9hZGluZ1NwaW5uZXJUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuXHJcbiAgICBAVmlld0NoaWxkKGZvcndhcmRSZWYoKCkgPT4gTmdEcm9wZG93blBhbmVsQ29tcG9uZW50KSkgZHJvcGRvd25QYW5lbDogTmdEcm9wZG93blBhbmVsQ29tcG9uZW50O1xyXG4gICAgQFZpZXdDaGlsZCgnc2VhcmNoSW5wdXQnLCB7IHN0YXRpYzogdHJ1ZSB9KSBzZWFyY2hJbnB1dDogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PjtcclxuICAgIEBDb250ZW50Q2hpbGRyZW4oTmdPcHRpb25Db21wb25lbnQsIHsgZGVzY2VuZGFudHM6IHRydWUgfSkgbmdPcHRpb25zOiBRdWVyeUxpc3Q8TmdPcHRpb25Db21wb25lbnQ+O1xyXG5cclxuICAgIEBIb3N0QmluZGluZygnY2xhc3Mubmctc2VsZWN0JykgdXNlRGVmYXVsdENsYXNzID0gdHJ1ZTtcclxuXHJcbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLm5nLXNlbGVjdC1kaXNhYmxlZCcpIGdldCBkaXNhYmxlZCgpIHsgcmV0dXJuIHRoaXMucmVhZG9ubHkgfHwgdGhpcy5fZGlzYWJsZWQgfTtcclxuXHJcbiAgICBASG9zdEJpbmRpbmcoJ2NsYXNzLm5nLXNlbGVjdC1maWx0ZXJlZCcpIGdldCBmaWx0ZXJlZCgpIHsgcmV0dXJuICghIXRoaXMuc2VhcmNoVGVybSAmJiB0aGlzLnNlYXJjaGFibGUgfHwgdGhpcy5faXNDb21wb3NpbmcpIH07XHJcblxyXG4gICAgQEhvc3RCaW5kaW5nKCdjbGFzcy5uZy1zZWxlY3Qtc2luZ2xlJykgZ2V0IHNpbmdsZSgpIHsgcmV0dXJuICF0aGlzLm11bHRpcGxlIH07XHJcblxyXG4gICAgaXRlbXNMaXN0OiBJdGVtc0xpc3Q7XHJcbiAgICB2aWV3UG9ydEl0ZW1zOiBOZ09wdGlvbltdID0gW107XHJcbiAgICBzZWFyY2hUZXJtOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgZHJvcGRvd25JZCA9IG5ld0lkKCk7XHJcbiAgICBlbGVtZW50OiBIVE1MRWxlbWVudDtcclxuICAgIGZvY3VzZWQ6IGJvb2xlYW47XHJcbiAgICBlc2NhcGVIVE1MID0gdHJ1ZTtcclxuXHJcbiAgICBwcml2YXRlIF9pdGVtcyA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfaXRlbXNBcmVVc2VkOiBib29sZWFuO1xyXG4gICAgcHJpdmF0ZSBfZGVmYXVsdExhYmVsID0gJ2xhYmVsJztcclxuICAgIHByaXZhdGUgX3ByaW1pdGl2ZTtcclxuICAgIHByaXZhdGUgX21hbnVhbE9wZW46IGJvb2xlYW47XHJcbiAgICBwcml2YXRlIF9kaXNhYmxlZDogYm9vbGVhbjtcclxuICAgIHByaXZhdGUgX3ByZXNzZWRLZXlzOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfY29tcGFyZVdpdGg6IENvbXBhcmVXaXRoRm47XHJcbiAgICBwcml2YXRlIF9jbGVhclNlYXJjaE9uQWRkOiBib29sZWFuO1xyXG4gICAgcHJpdmF0ZSBfaXNDb21wb3NpbmcgPSBmYWxzZTtcclxuXHJcbiAgICBwcml2YXRlIGdldCBfZWRpdGFibGVTZWFyY2hUZXJtKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmVkaXRhYmxlU2VhcmNoVGVybSAmJiAhdGhpcy5tdWx0aXBsZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9kZXN0cm95JCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9rZXlQcmVzcyQgPSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XHJcbiAgICBwcml2YXRlIF9vbkNoYW5nZSA9IChfOiBhbnkpID0+IHsgfTtcclxuICAgIHByaXZhdGUgX29uVG91Y2hlZCA9ICgpID0+IHsgfTtcclxuXHJcbiAgICBjbGVhckl0ZW0gPSAoaXRlbTogYW55KSA9PiB7XHJcbiAgICAgICAgY29uc3Qgb3B0aW9uID0gdGhpcy5zZWxlY3RlZEl0ZW1zLmZpbmQoeCA9PiB4LnZhbHVlID09PSBpdGVtKTtcclxuICAgICAgICB0aGlzLnVuc2VsZWN0KG9wdGlvbik7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIEBBdHRyaWJ1dGUoJ2NsYXNzJykgcHVibGljIGNsYXNzZXM6IHN0cmluZyxcclxuICAgICAgICBAQXR0cmlidXRlKCdhdXRvZm9jdXMnKSBwcml2YXRlIGF1dG9Gb2N1czogYW55LFxyXG4gICAgICAgIHB1YmxpYyBjb25maWc6IE5nU2VsZWN0Q29uZmlnLFxyXG4gICAgICAgIEBJbmplY3QoU0VMRUNUSU9OX01PREVMX0ZBQ1RPUlkpIG5ld1NlbGVjdGlvbk1vZGVsOiBTZWxlY3Rpb25Nb2RlbEZhY3RvcnksXHJcbiAgICAgICAgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxyXG4gICAgICAgIHByaXZhdGUgX2NkOiBDaGFuZ2VEZXRlY3RvclJlZixcclxuICAgICAgICBwcml2YXRlIF9jb25zb2xlOiBDb25zb2xlU2VydmljZVxyXG4gICAgKSB7XHJcbiAgICAgICAgdGhpcy5fbWVyZ2VHbG9iYWxDb25maWcoY29uZmlnKTtcclxuICAgICAgICB0aGlzLml0ZW1zTGlzdCA9IG5ldyBJdGVtc0xpc3QodGhpcywgbmV3U2VsZWN0aW9uTW9kZWwoKSk7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgc2VsZWN0ZWRJdGVtcygpOiBOZ09wdGlvbltdIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pdGVtc0xpc3Quc2VsZWN0ZWRJdGVtcztcclxuICAgIH1cclxuXHJcbiAgICBnZXQgc2VsZWN0ZWRWYWx1ZXMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRJdGVtcy5tYXAoeCA9PiB4LnZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaGFzVmFsdWUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRJdGVtcy5sZW5ndGggPiAwO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBjdXJyZW50UGFuZWxQb3NpdGlvbigpOiBEcm9wZG93blBvc2l0aW9uIHtcclxuICAgICAgICBpZiAodGhpcy5kcm9wZG93blBhbmVsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRyb3Bkb3duUGFuZWwuY3VycmVudFBvc2l0aW9uO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIG5nT25Jbml0KCkge1xyXG4gICAgICAgIHRoaXMuX2hhbmRsZUtleVByZXNzZXMoKTtcclxuICAgICAgICB0aGlzLl9zZXRJbnB1dEF0dHJpYnV0ZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XHJcbiAgICAgICAgaWYgKGNoYW5nZXMubXVsdGlwbGUpIHtcclxuICAgICAgICAgICAgdGhpcy5pdGVtc0xpc3QuY2xlYXJTZWxlY3RlZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY2hhbmdlcy5pdGVtcykge1xyXG4gICAgICAgICAgICB0aGlzLl9zZXRJdGVtcyhjaGFuZ2VzLml0ZW1zLmN1cnJlbnRWYWx1ZSB8fCBbXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjaGFuZ2VzLmlzT3Blbikge1xyXG4gICAgICAgICAgICB0aGlzLl9tYW51YWxPcGVuID0gaXNEZWZpbmVkKGNoYW5nZXMuaXNPcGVuLmN1cnJlbnRWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2l0ZW1zQXJlVXNlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmVzY2FwZUhUTUwgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5fc2V0SXRlbXNGcm9tTmdPcHRpb25zKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoaXNEZWZpbmVkKHRoaXMuYXV0b0ZvY3VzKSkge1xyXG4gICAgICAgICAgICB0aGlzLmZvY3VzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG5nT25EZXN0cm95KCkge1xyXG4gICAgICAgIHRoaXMuX2Rlc3Ryb3kkLm5leHQoKTtcclxuICAgICAgICB0aGlzLl9kZXN0cm95JC5jb21wbGV0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIEBIb3N0TGlzdGVuZXIoJ2tleWRvd24nLCBbJyRldmVudCddKVxyXG4gICAgaGFuZGxlS2V5RG93bigkZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcclxuICAgICAgICBjb25zdCBrZXlDb2RlID0gS2V5Q29kZVskZXZlbnQud2hpY2hdO1xyXG4gICAgICAgIGlmIChrZXlDb2RlKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmtleURvd25GbigkZXZlbnQpID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlS2V5Q29kZSgkZXZlbnQpXHJcbiAgICAgICAgfSBlbHNlIGlmICgkZXZlbnQua2V5ICYmICRldmVudC5rZXkubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2tleVByZXNzJC5uZXh0KCRldmVudC5rZXkudG9Mb2NhbGVMb3dlckNhc2UoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUtleUNvZGUoJGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XHJcbiAgICAgICAgc3dpdGNoICgkZXZlbnQud2hpY2gpIHtcclxuICAgICAgICBjYXNlIEtleUNvZGUuQXJyb3dEb3duOlxyXG4gICAgICAgICAgICB0aGlzLl9oYW5kbGVBcnJvd0Rvd24oJGV2ZW50KTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBLZXlDb2RlLkFycm93VXA6XHJcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZUFycm93VXAoJGV2ZW50KTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBLZXlDb2RlLlNwYWNlOlxyXG4gICAgICAgICAgICB0aGlzLl9oYW5kbGVTcGFjZSgkZXZlbnQpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEtleUNvZGUuRW50ZXI6XHJcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZUVudGVyKCRldmVudCk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgS2V5Q29kZS5UYWI6XHJcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZVRhYigkZXZlbnQpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEtleUNvZGUuRXNjOlxyXG4gICAgICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEtleUNvZGUuQmFja3NwYWNlOlxyXG4gICAgICAgICAgICB0aGlzLl9oYW5kbGVCYWNrc3BhY2UoKTtcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlTW91c2Vkb3duKCRldmVudDogTW91c2VFdmVudCkge1xyXG4gICAgICAgIGNvbnN0IHRhcmdldCA9ICRldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XHJcbiAgICAgICAgaWYgKHRhcmdldC50YWdOYW1lICE9PSAnSU5QVVQnKSB7XHJcbiAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ25nLWNsZWFyLXdyYXBwZXInKSkge1xyXG4gICAgICAgICAgICB0aGlzLmhhbmRsZUNsZWFyQ2xpY2soKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ25nLWFycm93LXdyYXBwZXInKSkge1xyXG4gICAgICAgICAgICB0aGlzLmhhbmRsZUFycm93Q2xpY2soKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ25nLXZhbHVlLWljb24nKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMuZm9jdXNlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmZvY3VzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5zZWFyY2hhYmxlKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3BlbigpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUFycm93Q2xpY2soKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNPcGVuKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLm9wZW4oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlQ2xlYXJDbGljaygpIHtcclxuICAgICAgICBpZiAodGhpcy5oYXNWYWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLml0ZW1zTGlzdC5jbGVhclNlbGVjdGVkKHRydWUpO1xyXG4gICAgICAgICAgICB0aGlzLl91cGRhdGVOZ01vZGVsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2NsZWFyU2VhcmNoKCk7XHJcbiAgICAgICAgdGhpcy5mb2N1cygpO1xyXG4gICAgICAgIHRoaXMuY2xlYXJFdmVudC5lbWl0KCk7XHJcblxyXG4gICAgICAgIHRoaXMuX29uU2VsZWN0aW9uQ2hhbmdlZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNsZWFyTW9kZWwoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNsZWFyYWJsZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaXRlbXNMaXN0LmNsZWFyU2VsZWN0ZWQoKTtcclxuICAgICAgICB0aGlzLl91cGRhdGVOZ01vZGVsKCk7XHJcbiAgICB9XHJcblxyXG4gICAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55IHwgYW55W10pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLml0ZW1zTGlzdC5jbGVhclNlbGVjdGVkKCk7XHJcbiAgICAgICAgdGhpcy5faGFuZGxlV3JpdGVWYWx1ZSh2YWx1ZSk7XHJcbiAgICAgICAgdGhpcy5fY2QubWFya0ZvckNoZWNrKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVnaXN0ZXJPbkNoYW5nZShmbjogYW55KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fb25DaGFuZ2UgPSBmbjtcclxuICAgIH1cclxuXHJcbiAgICByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fb25Ub3VjaGVkID0gZm47XHJcbiAgICB9XHJcblxyXG4gICAgc2V0RGlzYWJsZWRTdGF0ZShzdGF0ZTogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2Rpc2FibGVkID0gc3RhdGU7XHJcbiAgICAgICAgdGhpcy5fY2QubWFya0ZvckNoZWNrKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdG9nZ2xlKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pc09wZW4pIHtcclxuICAgICAgICAgICAgdGhpcy5vcGVuKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvcGVuKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IHRoaXMuaXNPcGVuIHx8IHRoaXMuaXRlbXNMaXN0Lm1heEl0ZW1zU2VsZWN0ZWQgfHwgdGhpcy5fbWFudWFsT3Blbikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMuX2lzVHlwZWFoZWFkICYmICF0aGlzLmFkZFRhZyAmJiB0aGlzLml0ZW1zTGlzdC5ub0l0ZW1zVG9TZWxlY3QpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmlzT3BlbiA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5pdGVtc0xpc3QubWFya1NlbGVjdGVkT3JEZWZhdWx0KHRoaXMubWFya0ZpcnN0KTtcclxuICAgICAgICB0aGlzLm9wZW5FdmVudC5lbWl0KCk7XHJcbiAgICAgICAgaWYgKCF0aGlzLnNlYXJjaFRlcm0pIHtcclxuICAgICAgICAgICAgdGhpcy5mb2N1cygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmRldGVjdENoYW5nZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBjbG9zZSgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaXNPcGVuIHx8IHRoaXMuX21hbnVhbE9wZW4pIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmlzT3BlbiA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX2lzQ29tcG9zaW5nID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9lZGl0YWJsZVNlYXJjaFRlcm0pIHtcclxuICAgICAgICAgICAgdGhpcy5fY2xlYXJTZWFyY2goKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLml0ZW1zTGlzdC5yZXNldEZpbHRlcmVkSXRlbXMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pdGVtc0xpc3QudW5tYXJrSXRlbSgpO1xyXG4gICAgICAgIHRoaXMuX29uVG91Y2hlZCgpO1xyXG4gICAgICAgIHRoaXMuY2xvc2VFdmVudC5lbWl0KCk7XHJcbiAgICAgICAgdGhpcy5fY2QubWFya0ZvckNoZWNrKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdG9nZ2xlSXRlbShpdGVtOiBOZ09wdGlvbikge1xyXG4gICAgICAgIGlmICghaXRlbSB8fCBpdGVtLmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMubXVsdGlwbGUgJiYgaXRlbS5zZWxlY3RlZCkge1xyXG4gICAgICAgICAgICB0aGlzLnVuc2VsZWN0KGl0ZW0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0KGl0ZW0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2VkaXRhYmxlU2VhcmNoVGVybSkge1xyXG4gICAgICAgICAgICB0aGlzLl9zZXRTZWFyY2hUZXJtRnJvbUl0ZW1zKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9vblNlbGVjdGlvbkNoYW5nZWQoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZWxlY3QoaXRlbTogTmdPcHRpb24pIHtcclxuICAgICAgICBpZiAoIWl0ZW0uc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5pdGVtc0xpc3Quc2VsZWN0KGl0ZW0pO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jbGVhclNlYXJjaE9uQWRkICYmICF0aGlzLl9lZGl0YWJsZVNlYXJjaFRlcm0pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NsZWFyU2VhcmNoKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZU5nTW9kZWwoKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMubXVsdGlwbGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkRXZlbnQuZW1pdChpdGVtLnZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY2xvc2VPblNlbGVjdCB8fCB0aGlzLml0ZW1zTGlzdC5ub0l0ZW1zVG9TZWxlY3QpIHtcclxuICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmb2N1cygpIHtcclxuICAgICAgICB0aGlzLnNlYXJjaElucHV0Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBibHVyKCkge1xyXG4gICAgICAgIHRoaXMuc2VhcmNoSW5wdXQubmF0aXZlRWxlbWVudC5ibHVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdW5zZWxlY3QoaXRlbTogTmdPcHRpb24pIHtcclxuICAgICAgICBpZiAoIWl0ZW0pIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pdGVtc0xpc3QudW5zZWxlY3QoaXRlbSk7XHJcbiAgICAgICAgdGhpcy5mb2N1cygpO1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZU5nTW9kZWwoKTtcclxuICAgICAgICB0aGlzLnJlbW92ZUV2ZW50LmVtaXQoaXRlbSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZWN0VGFnKCkge1xyXG4gICAgICAgIGxldCB0YWc7XHJcbiAgICAgICAgaWYgKGlzRnVuY3Rpb24odGhpcy5hZGRUYWcpKSB7XHJcbiAgICAgICAgICAgIHRhZyA9ICg8QWRkVGFnRm4+dGhpcy5hZGRUYWcpKHRoaXMuc2VhcmNoVGVybSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGFnID0gdGhpcy5fcHJpbWl0aXZlID8gdGhpcy5zZWFyY2hUZXJtIDogeyBbdGhpcy5iaW5kTGFiZWxdOiB0aGlzLnNlYXJjaFRlcm0gfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGhhbmRsZVRhZyA9IChpdGVtKSA9PiB0aGlzLl9pc1R5cGVhaGVhZCB8fCAhdGhpcy5pc09wZW4gPyB0aGlzLml0ZW1zTGlzdC5tYXBJdGVtKGl0ZW0sIG51bGwpIDogdGhpcy5pdGVtc0xpc3QuYWRkSXRlbShpdGVtKTtcclxuICAgICAgICBpZiAoaXNQcm9taXNlKHRhZykpIHtcclxuICAgICAgICAgICAgdGFnLnRoZW4oaXRlbSA9PiB0aGlzLnNlbGVjdChoYW5kbGVUYWcoaXRlbSkpKS5jYXRjaCgoKSA9PiB7IH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGFnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0KGhhbmRsZVRhZyh0YWcpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd0NsZWFyKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsZWFyYWJsZSAmJiAodGhpcy5oYXNWYWx1ZSB8fCB0aGlzLnNlYXJjaFRlcm0pICYmICF0aGlzLmRpc2FibGVkO1xyXG4gICAgfVxyXG5cclxuICAgIHRyYWNrQnlPcHRpb24gPSAoXzogbnVtYmVyLCBpdGVtOiBOZ09wdGlvbikgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLnRyYWNrQnlGbikge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50cmFja0J5Rm4oaXRlbS52YWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgIH07XHJcblxyXG4gICAgZ2V0IHNob3dBZGRUYWcoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl92YWxpZFRlcm0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdGVybSA9IHRoaXMuc2VhcmNoVGVybS50b0xvd2VyQ2FzZSgpLnRyaW0oKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5hZGRUYWcgJiZcclxuICAgICAgICAgICAgKCF0aGlzLml0ZW1zTGlzdC5maWx0ZXJlZEl0ZW1zLnNvbWUoeCA9PiB4LmxhYmVsLnRvTG93ZXJDYXNlKCkgPT09IHRlcm0pICYmXHJcbiAgICAgICAgICAgICAgICAoIXRoaXMuaGlkZVNlbGVjdGVkICYmIHRoaXMuaXNPcGVuIHx8ICF0aGlzLnNlbGVjdGVkSXRlbXMuc29tZSh4ID0+IHgubGFiZWwudG9Mb3dlckNhc2UoKSA9PT0gdGVybSkpKSAmJlxyXG4gICAgICAgICAgICAhdGhpcy5sb2FkaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3dOb0l0ZW1zRm91bmQoKSB7XHJcbiAgICAgICAgY29uc3QgZW1wdHkgPSB0aGlzLml0ZW1zTGlzdC5maWx0ZXJlZEl0ZW1zLmxlbmd0aCA9PT0gMDtcclxuICAgICAgICByZXR1cm4gKChlbXB0eSAmJiAhdGhpcy5faXNUeXBlYWhlYWQgJiYgIXRoaXMubG9hZGluZykgfHxcclxuICAgICAgICAgICAgKGVtcHR5ICYmIHRoaXMuX2lzVHlwZWFoZWFkICYmIHRoaXMuX3ZhbGlkVGVybSAmJiAhdGhpcy5sb2FkaW5nKSkgJiZcclxuICAgICAgICAgICAgIXRoaXMuc2hvd0FkZFRhZztcclxuICAgIH1cclxuXHJcbiAgICBzaG93VHlwZVRvU2VhcmNoKCkge1xyXG4gICAgICAgIGNvbnN0IGVtcHR5ID0gdGhpcy5pdGVtc0xpc3QuZmlsdGVyZWRJdGVtcy5sZW5ndGggPT09IDA7XHJcbiAgICAgICAgcmV0dXJuIGVtcHR5ICYmIHRoaXMuX2lzVHlwZWFoZWFkICYmICF0aGlzLl92YWxpZFRlcm0gJiYgIXRoaXMubG9hZGluZztcclxuICAgIH1cclxuXHJcbiAgICBvbkNvbXBvc2l0aW9uU3RhcnQoKSB7XHJcbiAgICAgICAgdGhpcy5faXNDb21wb3NpbmcgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIG9uQ29tcG9zaXRpb25FbmQodGVybTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5faXNDb21wb3NpbmcgPSBmYWxzZTtcclxuICAgICAgICBpZiAodGhpcy5zZWFyY2hXaGlsZUNvbXBvc2luZykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmZpbHRlcih0ZXJtKTtcclxuICAgIH1cclxuXHJcbiAgICBmaWx0ZXIodGVybTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2lzQ29tcG9zaW5nICYmICF0aGlzLnNlYXJjaFdoaWxlQ29tcG9zaW5nKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc2VhcmNoVGVybSA9IHRlcm07XHJcbiAgICAgICAgaWYgKHRoaXMuX2lzVHlwZWFoZWFkICYmICh0aGlzLl92YWxpZFRlcm0gfHwgdGhpcy5taW5UZXJtTGVuZ3RoID09PSAwKSkge1xyXG4gICAgICAgICAgICB0aGlzLnR5cGVhaGVhZC5uZXh0KHRlcm0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLl9pc1R5cGVhaGVhZCkge1xyXG4gICAgICAgICAgICB0aGlzLml0ZW1zTGlzdC5maWx0ZXIodGhpcy5zZWFyY2hUZXJtKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNPcGVuKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLml0ZW1zTGlzdC5tYXJrU2VsZWN0ZWRPckRlZmF1bHQodGhpcy5tYXJrRmlyc3QpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNlYXJjaEV2ZW50LmVtaXQoeyB0ZXJtLCBpdGVtczogdGhpcy5pdGVtc0xpc3QuZmlsdGVyZWRJdGVtcy5tYXAoeCA9PiB4LnZhbHVlKSB9KTtcclxuICAgICAgICB0aGlzLm9wZW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBvbklucHV0Rm9jdXMoJGV2ZW50KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZm9jdXNlZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fZWRpdGFibGVTZWFyY2hUZXJtKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NldFNlYXJjaFRlcm1Gcm9tSXRlbXMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCduZy1zZWxlY3QtZm9jdXNlZCcpO1xyXG4gICAgICAgIHRoaXMuZm9jdXNFdmVudC5lbWl0KCRldmVudCk7XHJcbiAgICAgICAgdGhpcy5mb2N1c2VkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBvbklucHV0Qmx1cigkZXZlbnQpIHtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnbmctc2VsZWN0LWZvY3VzZWQnKTtcclxuICAgICAgICB0aGlzLmJsdXJFdmVudC5lbWl0KCRldmVudCk7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlzT3BlbiAmJiAhdGhpcy5kaXNhYmxlZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9vblRvdWNoZWQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuX2VkaXRhYmxlU2VhcmNoVGVybSkge1xyXG4gICAgICAgICAgICB0aGlzLl9zZXRTZWFyY2hUZXJtRnJvbUl0ZW1zKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZm9jdXNlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIG9uSXRlbUhvdmVyKGl0ZW06IE5nT3B0aW9uKSB7XHJcbiAgICAgICAgaWYgKGl0ZW0uZGlzYWJsZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLml0ZW1zTGlzdC5tYXJrSXRlbShpdGVtKTtcclxuICAgIH1cclxuXHJcbiAgICBkZXRlY3RDaGFuZ2VzKCkge1xyXG4gICAgICAgIGlmICghKDxhbnk+dGhpcy5fY2QpLmRlc3Ryb3llZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9jZC5kZXRlY3RDaGFuZ2VzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3NldFNlYXJjaFRlcm1Gcm9tSXRlbXMoKSB7XHJcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWQgPSB0aGlzLnNlbGVjdGVkSXRlbXMgJiYgdGhpcy5zZWxlY3RlZEl0ZW1zWzBdO1xyXG4gICAgICAgIHRoaXMuc2VhcmNoVGVybSA9IChzZWxlY3RlZCAmJiBzZWxlY3RlZC5sYWJlbCkgfHwgbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9zZXRJdGVtcyhpdGVtczogYW55W10pIHtcclxuICAgICAgICBjb25zdCBmaXJzdEl0ZW0gPSBpdGVtc1swXTtcclxuICAgICAgICB0aGlzLmJpbmRMYWJlbCA9IHRoaXMuYmluZExhYmVsIHx8IHRoaXMuX2RlZmF1bHRMYWJlbDtcclxuICAgICAgICB0aGlzLl9wcmltaXRpdmUgPSBpc0RlZmluZWQoZmlyc3RJdGVtKSA/ICFpc09iamVjdChmaXJzdEl0ZW0pIDogdGhpcy5fcHJpbWl0aXZlIHx8IHRoaXMuYmluZExhYmVsID09PSB0aGlzLl9kZWZhdWx0TGFiZWw7XHJcbiAgICAgICAgdGhpcy5pdGVtc0xpc3Quc2V0SXRlbXMoaXRlbXMpO1xyXG4gICAgICAgIGlmIChpdGVtcy5sZW5ndGggPiAwICYmIHRoaXMuaGFzVmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy5pdGVtc0xpc3QubWFwU2VsZWN0ZWRJdGVtcygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pc09wZW4gJiYgaXNEZWZpbmVkKHRoaXMuc2VhcmNoVGVybSkgJiYgIXRoaXMuX2lzVHlwZWFoZWFkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXRlbXNMaXN0LmZpbHRlcih0aGlzLnNlYXJjaFRlcm0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5faXNUeXBlYWhlYWQgfHwgdGhpcy5pc09wZW4pIHtcclxuICAgICAgICAgICAgdGhpcy5pdGVtc0xpc3QubWFya1NlbGVjdGVkT3JEZWZhdWx0KHRoaXMubWFya0ZpcnN0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfc2V0SXRlbXNGcm9tTmdPcHRpb25zKCkge1xyXG4gICAgICAgIGNvbnN0IG1hcE5nT3B0aW9ucyA9IChvcHRpb25zOiBRdWVyeUxpc3Q8TmdPcHRpb25Db21wb25lbnQ+KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaXRlbXMgPSBvcHRpb25zLm1hcChvcHRpb24gPT4gKHtcclxuICAgICAgICAgICAgICAgICRuZ09wdGlvblZhbHVlOiBvcHRpb24udmFsdWUsXHJcbiAgICAgICAgICAgICAgICAkbmdPcHRpb25MYWJlbDogb3B0aW9uLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5pbm5lckhUTUwsXHJcbiAgICAgICAgICAgICAgICBkaXNhYmxlZDogb3B0aW9uLmRpc2FibGVkXHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgdGhpcy5pdGVtc0xpc3Quc2V0SXRlbXModGhpcy5pdGVtcyk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLml0ZW1zTGlzdC5tYXBTZWxlY3RlZEl0ZW1zKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5kZXRlY3RDaGFuZ2VzKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgaGFuZGxlT3B0aW9uQ2hhbmdlID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBjaGFuZ2VkT3JEZXN0cm95ZWQgPSBtZXJnZSh0aGlzLm5nT3B0aW9ucy5jaGFuZ2VzLCB0aGlzLl9kZXN0cm95JCk7XHJcbiAgICAgICAgICAgIG1lcmdlKC4uLnRoaXMubmdPcHRpb25zLm1hcChvcHRpb24gPT4gb3B0aW9uLnN0YXRlQ2hhbmdlJCkpXHJcbiAgICAgICAgICAgICAgICAucGlwZSh0YWtlVW50aWwoY2hhbmdlZE9yRGVzdHJveWVkKSlcclxuICAgICAgICAgICAgICAgIC5zdWJzY3JpYmUob3B0aW9uID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpdGVtID0gdGhpcy5pdGVtc0xpc3QuZmluZEl0ZW0ob3B0aW9uLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLmRpc2FibGVkID0gb3B0aW9uLmRpc2FibGVkO1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0ubGFiZWwgPSBvcHRpb24ubGFiZWwgfHwgaXRlbS5sYWJlbDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jZC5kZXRlY3RDaGFuZ2VzKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLm5nT3B0aW9ucy5jaGFuZ2VzXHJcbiAgICAgICAgICAgIC5waXBlKHN0YXJ0V2l0aCh0aGlzLm5nT3B0aW9ucyksIHRha2VVbnRpbCh0aGlzLl9kZXN0cm95JCkpXHJcbiAgICAgICAgICAgIC5zdWJzY3JpYmUob3B0aW9ucyA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJpbmRMYWJlbCA9IHRoaXMuX2RlZmF1bHRMYWJlbDtcclxuICAgICAgICAgICAgICAgIG1hcE5nT3B0aW9ucyhvcHRpb25zKTtcclxuICAgICAgICAgICAgICAgIGhhbmRsZU9wdGlvbkNoYW5nZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9pc1ZhbGlkV3JpdGVWYWx1ZSh2YWx1ZTogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKCFpc0RlZmluZWQodmFsdWUpIHx8ICh0aGlzLm11bHRpcGxlICYmIHZhbHVlID09PSAnJykgfHwgQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiYgdmFsdWUubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHZhbGlkYXRlQmluZGluZyA9IChpdGVtOiBhbnkpOiBib29sZWFuID0+IHtcclxuICAgICAgICAgICAgaWYgKCFpc0RlZmluZWQodGhpcy5jb21wYXJlV2l0aCkgJiYgaXNPYmplY3QoaXRlbSkgJiYgdGhpcy5iaW5kVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NvbnNvbGUud2FybihcclxuICAgICAgICAgICAgICAgICAgICBgU2V0dGluZyBvYmplY3QoJHtKU09OLnN0cmluZ2lmeShpdGVtKX0pIGFzIHlvdXIgbW9kZWwgd2l0aCBiaW5kVmFsdWUgaXMgbm90IGFsbG93ZWQgdW5sZXNzIFtjb21wYXJlV2l0aF0gaXMgdXNlZC5gXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm11bHRpcGxlKSB7XHJcbiAgICAgICAgICAgIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NvbnNvbGUud2FybignTXVsdGlwbGUgc2VsZWN0IG5nTW9kZWwgc2hvdWxkIGJlIGFycmF5LicpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZS5ldmVyeShpdGVtID0+IHZhbGlkYXRlQmluZGluZyhpdGVtKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbGlkYXRlQmluZGluZyh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2hhbmRsZVdyaXRlVmFsdWUobmdNb2RlbDogYW55IHwgYW55W10pIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2lzVmFsaWRXcml0ZVZhbHVlKG5nTW9kZWwpKSB7XHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qgc2VsZWN0ID0gKHZhbDogYW55KSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5pdGVtc0xpc3QuZmluZEl0ZW0odmFsKTtcclxuICAgICAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXRlbXNMaXN0LnNlbGVjdChpdGVtKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGlzVmFsT2JqZWN0ID0gaXNPYmplY3QodmFsKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGlzUHJpbWl0aXZlID0gIWlzVmFsT2JqZWN0ICYmICF0aGlzLmJpbmRWYWx1ZTtcclxuICAgICAgICAgICAgICAgIGlmICgoaXNWYWxPYmplY3QgfHwgaXNQcmltaXRpdmUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtc0xpc3Quc2VsZWN0KHRoaXMuaXRlbXNMaXN0Lm1hcEl0ZW0odmFsLCBudWxsKSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYmluZFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgW3RoaXMuYmluZExhYmVsXTogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgW3RoaXMuYmluZFZhbHVlXTogdmFsXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLml0ZW1zTGlzdC5zZWxlY3QodGhpcy5pdGVtc0xpc3QubWFwSXRlbShpdGVtLCBudWxsKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAodGhpcy5tdWx0aXBsZSkge1xyXG4gICAgICAgICAgICAoPGFueVtdPm5nTW9kZWwpLmZvckVhY2goaXRlbSA9PiBzZWxlY3QoaXRlbSkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHNlbGVjdChuZ01vZGVsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfaGFuZGxlS2V5UHJlc3NlcygpIHtcclxuICAgICAgICBpZiAodGhpcy5zZWFyY2hhYmxlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2tleVByZXNzJFxyXG4gICAgICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSQpLFxyXG4gICAgICAgICAgICAgICAgdGFwKGxldHRlciA9PiB0aGlzLl9wcmVzc2VkS2V5cy5wdXNoKGxldHRlcikpLFxyXG4gICAgICAgICAgICAgICAgZGVib3VuY2VUaW1lKDIwMCksXHJcbiAgICAgICAgICAgICAgICBmaWx0ZXIoKCkgPT4gdGhpcy5fcHJlc3NlZEtleXMubGVuZ3RoID4gMCksXHJcbiAgICAgICAgICAgICAgICBtYXAoKCkgPT4gdGhpcy5fcHJlc3NlZEtleXMuam9pbignJykpKVxyXG4gICAgICAgICAgICAuc3Vic2NyaWJlKHRlcm0gPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMuaXRlbXNMaXN0LmZpbmRCeUxhYmVsKHRlcm0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc09wZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtc0xpc3QubWFya0l0ZW0oaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3Njcm9sbFRvTWFya2VkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NkLm1hcmtGb3JDaGVjaygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0KGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX3ByZXNzZWRLZXlzID0gW107XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3NldElucHV0QXR0cmlidXRlcygpIHtcclxuICAgICAgICBjb25zdCBpbnB1dCA9IHRoaXMuc2VhcmNoSW5wdXQubmF0aXZlRWxlbWVudDtcclxuICAgICAgICBjb25zdCBhdHRyaWJ1dGVzID0ge1xyXG4gICAgICAgICAgICB0eXBlOiAndGV4dCcsXHJcbiAgICAgICAgICAgIGF1dG9jb3JyZWN0OiAnb2ZmJyxcclxuICAgICAgICAgICAgYXV0b2NhcGl0YWxpemU6ICdvZmYnLFxyXG4gICAgICAgICAgICBhdXRvY29tcGxldGU6IHRoaXMubGFiZWxGb3JJZCA/ICdvZmYnIDogdGhpcy5kcm9wZG93bklkLFxyXG4gICAgICAgICAgICAuLi50aGlzLmlucHV0QXR0cnNcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKSkge1xyXG4gICAgICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoa2V5LCBhdHRyaWJ1dGVzW2tleV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF91cGRhdGVOZ01vZGVsKCkge1xyXG4gICAgICAgIGNvbnN0IG1vZGVsID0gW107XHJcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHRoaXMuc2VsZWN0ZWRJdGVtcykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5iaW5kVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGdyb3VwS2V5ID0gdGhpcy5ncm91cFZhbHVlID8gdGhpcy5iaW5kVmFsdWUgOiA8c3RyaW5nPnRoaXMuZ3JvdXBCeTtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGl0ZW0udmFsdWVbZ3JvdXBLZXkgfHwgPHN0cmluZz50aGlzLmdyb3VwQnldO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMuaXRlbXNMaXN0LnJlc29sdmVOZXN0ZWQoaXRlbS52YWx1ZSwgdGhpcy5iaW5kVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbW9kZWwucHVzaCh2YWx1ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBtb2RlbC5wdXNoKGl0ZW0udmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBzZWxlY3RlZCA9IHRoaXMuc2VsZWN0ZWRJdGVtcy5tYXAoeCA9PiB4LnZhbHVlKTtcclxuICAgICAgICBpZiAodGhpcy5tdWx0aXBsZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9vbkNoYW5nZShtb2RlbCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlRXZlbnQuZW1pdChzZWxlY3RlZCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fb25DaGFuZ2UoaXNEZWZpbmVkKG1vZGVsWzBdKSA/IG1vZGVsWzBdIDogbnVsbCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlRXZlbnQuZW1pdChzZWxlY3RlZFswXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9jZC5tYXJrRm9yQ2hlY2soKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9jbGVhclNlYXJjaCgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuc2VhcmNoVGVybSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9jaGFuZ2VTZWFyY2gobnVsbCk7XHJcbiAgICAgICAgdGhpcy5pdGVtc0xpc3QucmVzZXRGaWx0ZXJlZEl0ZW1zKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfY2hhbmdlU2VhcmNoKHNlYXJjaFRlcm06IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuc2VhcmNoVGVybSA9IHNlYXJjaFRlcm07XHJcbiAgICAgICAgaWYgKHRoaXMuX2lzVHlwZWFoZWFkKSB7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZWFoZWFkLm5leHQoc2VhcmNoVGVybSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3Njcm9sbFRvTWFya2VkKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pc09wZW4gfHwgIXRoaXMuZHJvcGRvd25QYW5lbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZHJvcGRvd25QYW5lbC5zY3JvbGxUbyh0aGlzLml0ZW1zTGlzdC5tYXJrZWRJdGVtKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9zY3JvbGxUb1RhZygpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaXNPcGVuIHx8ICF0aGlzLmRyb3Bkb3duUGFuZWwpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmRyb3Bkb3duUGFuZWwuc2Nyb2xsVG9UYWcoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9vblNlbGVjdGlvbkNoYW5nZWQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNPcGVuICYmIHRoaXMubXVsdGlwbGUgJiYgdGhpcy5hcHBlbmRUbykge1xyXG4gICAgICAgICAgICAvLyBNYWtlIHN1cmUgaXRlbXMgYXJlIHJlbmRlcmVkLlxyXG4gICAgICAgICAgICB0aGlzLl9jZC5kZXRlY3RDaGFuZ2VzKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZHJvcGRvd25QYW5lbC5hZGp1c3RQb3NpdGlvbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9oYW5kbGVUYWIoJGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNPcGVuID09PSBmYWxzZSAmJiAhdGhpcy5hZGRUYWcpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0T25UYWIpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXRlbXNMaXN0Lm1hcmtlZEl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlSXRlbSh0aGlzLml0ZW1zTGlzdC5tYXJrZWRJdGVtKTtcclxuICAgICAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuc2hvd0FkZFRhZykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RUYWcoKTtcclxuICAgICAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9oYW5kbGVFbnRlcigkZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcclxuICAgICAgICBpZiAodGhpcy5pc09wZW4gfHwgdGhpcy5fbWFudWFsT3Blbikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pdGVtc0xpc3QubWFya2VkSXRlbSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b2dnbGVJdGVtKHRoaXMuaXRlbXNMaXN0Lm1hcmtlZEl0ZW0pO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuc2hvd0FkZFRhZykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RUYWcoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5vcGVuT25FbnRlcikge1xyXG4gICAgICAgICAgICB0aGlzLm9wZW4oKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9oYW5kbGVTcGFjZSgkZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcclxuICAgICAgICBpZiAodGhpcy5pc09wZW4gfHwgdGhpcy5fbWFudWFsT3Blbikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMub3BlbigpO1xyXG4gICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2hhbmRsZUFycm93RG93bigkZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcclxuICAgICAgICBpZiAodGhpcy5fbmV4dEl0ZW1Jc1RhZygrMSkpIHtcclxuICAgICAgICAgICAgdGhpcy5pdGVtc0xpc3QudW5tYXJrSXRlbSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxUb1RhZygpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXRlbXNMaXN0Lm1hcmtOZXh0SXRlbSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxUb01hcmtlZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm9wZW4oKTtcclxuICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9oYW5kbGVBcnJvd1VwKCRldmVudDogS2V5Ym9hcmRFdmVudCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pc09wZW4pIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX25leHRJdGVtSXNUYWcoLTEpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXRlbXNMaXN0LnVubWFya0l0ZW0oKTtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsVG9UYWcoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLml0ZW1zTGlzdC5tYXJrUHJldmlvdXNJdGVtKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbFRvTWFya2VkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX25leHRJdGVtSXNUYWcobmV4dFN0ZXA6IG51bWJlcik6IGJvb2xlYW4ge1xyXG4gICAgICAgIGNvbnN0IG5leHRJbmRleCA9IHRoaXMuaXRlbXNMaXN0Lm1hcmtlZEluZGV4ICsgbmV4dFN0ZXA7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkVGFnICYmIHRoaXMuc2VhcmNoVGVybVxyXG4gICAgICAgICAgICAmJiB0aGlzLml0ZW1zTGlzdC5tYXJrZWRJdGVtXHJcbiAgICAgICAgICAgICYmIChuZXh0SW5kZXggPCAwIHx8IG5leHRJbmRleCA9PT0gdGhpcy5pdGVtc0xpc3QuZmlsdGVyZWRJdGVtcy5sZW5ndGgpXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfaGFuZGxlQmFja3NwYWNlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnNlYXJjaFRlcm0gfHwgIXRoaXMuY2xlYXJhYmxlIHx8ICF0aGlzLmNsZWFyT25CYWNrc3BhY2UgfHwgIXRoaXMuaGFzVmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMubXVsdGlwbGUpIHtcclxuICAgICAgICAgICAgdGhpcy51bnNlbGVjdCh0aGlzLml0ZW1zTGlzdC5sYXN0U2VsZWN0ZWRJdGVtKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmNsZWFyTW9kZWwoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXQgX2lzVHlwZWFoZWFkKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnR5cGVhaGVhZCAmJiB0aGlzLnR5cGVhaGVhZC5vYnNlcnZlcnMubGVuZ3RoID4gMDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldCBfdmFsaWRUZXJtKCkge1xyXG4gICAgICAgIGNvbnN0IHRlcm0gPSB0aGlzLnNlYXJjaFRlcm0gJiYgdGhpcy5zZWFyY2hUZXJtLnRyaW0oKTtcclxuICAgICAgICByZXR1cm4gdGVybSAmJiB0ZXJtLmxlbmd0aCA+PSB0aGlzLm1pblRlcm1MZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfbWVyZ2VHbG9iYWxDb25maWcoY29uZmlnOiBOZ1NlbGVjdENvbmZpZykge1xyXG4gICAgICAgIHRoaXMucGxhY2Vob2xkZXIgPSB0aGlzLnBsYWNlaG9sZGVyIHx8IGNvbmZpZy5wbGFjZWhvbGRlcjtcclxuICAgICAgICB0aGlzLm5vdEZvdW5kVGV4dCA9IHRoaXMubm90Rm91bmRUZXh0IHx8IGNvbmZpZy5ub3RGb3VuZFRleHQ7XHJcbiAgICAgICAgdGhpcy50eXBlVG9TZWFyY2hUZXh0ID0gdGhpcy50eXBlVG9TZWFyY2hUZXh0IHx8IGNvbmZpZy50eXBlVG9TZWFyY2hUZXh0O1xyXG4gICAgICAgIHRoaXMuYWRkVGFnVGV4dCA9IHRoaXMuYWRkVGFnVGV4dCB8fCBjb25maWcuYWRkVGFnVGV4dDtcclxuICAgICAgICB0aGlzLmxvYWRpbmdUZXh0ID0gdGhpcy5sb2FkaW5nVGV4dCB8fCBjb25maWcubG9hZGluZ1RleHQ7XHJcbiAgICAgICAgdGhpcy5jbGVhckFsbFRleHQgPSB0aGlzLmNsZWFyQWxsVGV4dCB8fCBjb25maWcuY2xlYXJBbGxUZXh0O1xyXG4gICAgICAgIHRoaXMudmlydHVhbFNjcm9sbCA9IGlzRGVmaW5lZCh0aGlzLnZpcnR1YWxTY3JvbGwpXHJcbiAgICAgICAgICAgID8gdGhpcy52aXJ0dWFsU2Nyb2xsXHJcbiAgICAgICAgICAgIDogaXNEZWZpbmVkKGNvbmZpZy5kaXNhYmxlVmlydHVhbFNjcm9sbCkgPyAhY29uZmlnLmRpc2FibGVWaXJ0dWFsU2Nyb2xsIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5vcGVuT25FbnRlciA9IGlzRGVmaW5lZCh0aGlzLm9wZW5PbkVudGVyKSA/IHRoaXMub3Blbk9uRW50ZXIgOiBjb25maWcub3Blbk9uRW50ZXI7XHJcbiAgICAgICAgdGhpcy5hcHBlbmRUbyA9IHRoaXMuYXBwZW5kVG8gfHwgY29uZmlnLmFwcGVuZFRvO1xyXG4gICAgICAgIHRoaXMuYmluZFZhbHVlID0gdGhpcy5iaW5kVmFsdWUgfHwgY29uZmlnLmJpbmRWYWx1ZTtcclxuICAgICAgICB0aGlzLmJpbmRMYWJlbCA9IHRoaXMuYmluZExhYmVsIHx8IGNvbmZpZy5iaW5kTGFiZWw7XHJcbiAgICAgICAgdGhpcy5hcHBlYXJhbmNlID0gdGhpcy5hcHBlYXJhbmNlIHx8IGNvbmZpZy5hcHBlYXJhbmNlO1xyXG4gICAgfVxyXG59XHJcbiIsIjxkaXZcclxuICAgIChtb3VzZWRvd24pPVwiaGFuZGxlTW91c2Vkb3duKCRldmVudClcIlxyXG4gICAgW2NsYXNzLm5nLWFwcGVhcmFuY2Utb3V0bGluZV09XCJhcHBlYXJhbmNlID09PSAnb3V0bGluZSdcIlxyXG4gICAgW2NsYXNzLm5nLWhhcy12YWx1ZV09XCJoYXNWYWx1ZVwiXHJcbiAgICBjbGFzcz1cIm5nLXNlbGVjdC1jb250YWluZXJcIj5cclxuXHJcbiAgICA8ZGl2IGNsYXNzPVwibmctdmFsdWUtY29udGFpbmVyXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIm5nLXBsYWNlaG9sZGVyXCI+e3twbGFjZWhvbGRlcn19PC9kaXY+XHJcblxyXG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCIoIW11bHRpTGFiZWxUZW1wbGF0ZSAgfHwgIW11bHRpcGxlICkgJiYgc2VsZWN0ZWRJdGVtcy5sZW5ndGggPiAwXCI+XHJcbiAgICAgICAgICAgIDxkaXYgW2NsYXNzLm5nLXZhbHVlLWRpc2FibGVkXT1cIml0ZW0uZGlzYWJsZWRcIiBjbGFzcz1cIm5nLXZhbHVlXCIgKm5nRm9yPVwibGV0IGl0ZW0gb2Ygc2VsZWN0ZWRJdGVtczsgdHJhY2tCeTogdHJhY2tCeU9wdGlvblwiPlxyXG4gICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlICNkZWZhdWx0TGFiZWxUZW1wbGF0ZT5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm5nLXZhbHVlLWljb24gbGVmdFwiIChjbGljayk9XCJ1bnNlbGVjdChpdGVtKTtcIiBhcmlhLWhpZGRlbj1cInRydWVcIj7Dlzwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm5nLXZhbHVlLWxhYmVsXCIgW25nSXRlbUxhYmVsXT1cIml0ZW0ubGFiZWxcIiBbZXNjYXBlXT1cImVzY2FwZUhUTUxcIj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxyXG5cclxuICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZVxyXG4gICAgICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImxhYmVsVGVtcGxhdGUgfHwgZGVmYXVsdExhYmVsVGVtcGxhdGVcIlxyXG4gICAgICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7IGl0ZW06IGl0ZW0udmFsdWUsIGNsZWFyOiBjbGVhckl0ZW0sIGxhYmVsOiBpdGVtLmxhYmVsIH1cIj5cclxuICAgICAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvbmctY29udGFpbmVyPlxyXG5cclxuICAgICAgICA8bmctdGVtcGxhdGUgKm5nSWY9XCJtdWx0aXBsZSAmJiBtdWx0aUxhYmVsVGVtcGxhdGUgJiYgc2VsZWN0ZWRWYWx1ZXMubGVuZ3RoID4gMFwiXHJcbiAgICAgICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJtdWx0aUxhYmVsVGVtcGxhdGVcIlxyXG4gICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInsgaXRlbXM6IHNlbGVjdGVkVmFsdWVzLCBjbGVhcjogY2xlYXJJdGVtIH1cIj5cclxuICAgICAgICA8L25nLXRlbXBsYXRlPlxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwibmctaW5wdXRcIlxyXG4gICAgICAgICAgICByb2xlPVwiY29tYm9ib3hcIiBcclxuICAgICAgICAgICAgW2F0dHIuYXJpYS1leHBhbmRlZF09XCJpc09wZW5cIiBcclxuICAgICAgICAgICAgW2F0dHIuYXJpYS1vd25zXT1cImlzT3BlbiA/IGRyb3Bkb3duSWQgOiBudWxsXCIgXHJcbiAgICAgICAgICAgIGFyaWEtaGFzcG9wdXA9XCJsaXN0Ym94XCI+XHJcblxyXG4gICAgICAgICAgICA8aW5wdXQgI3NlYXJjaElucHV0XHJcbiAgICAgICAgICAgICAgICAgICBbYXR0ci5pZF09XCJsYWJlbEZvcklkXCJcclxuICAgICAgICAgICAgICAgICAgIFthdHRyLnRhYmluZGV4XT1cInRhYkluZGV4XCJcclxuICAgICAgICAgICAgICAgICAgIFtyZWFkT25seV09XCIhc2VhcmNoYWJsZSB8fCBpdGVtc0xpc3QubWF4SXRlbXNTZWxlY3RlZFwiXHJcbiAgICAgICAgICAgICAgICAgICBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIlxyXG4gICAgICAgICAgICAgICAgICAgW3ZhbHVlXT1cInNlYXJjaFRlcm0gPyBzZWFyY2hUZXJtIDogJydcIlxyXG4gICAgICAgICAgICAgICAgICAgKGlucHV0KT1cImZpbHRlcihzZWFyY2hJbnB1dC52YWx1ZSlcIlxyXG4gICAgICAgICAgICAgICAgICAgKGNvbXBvc2l0aW9uc3RhcnQpPVwib25Db21wb3NpdGlvblN0YXJ0KClcIlxyXG4gICAgICAgICAgICAgICAgICAgKGNvbXBvc2l0aW9uZW5kKT1cIm9uQ29tcG9zaXRpb25FbmQoc2VhcmNoSW5wdXQudmFsdWUpXCJcclxuICAgICAgICAgICAgICAgICAgIChmb2N1cyk9XCJvbklucHV0Rm9jdXMoJGV2ZW50KVwiXHJcbiAgICAgICAgICAgICAgICAgICAoYmx1cik9XCJvbklucHV0Qmx1cigkZXZlbnQpXCJcclxuICAgICAgICAgICAgICAgICAgIChjaGFuZ2UpPVwiJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXCJcclxuICAgICAgICAgICAgICAgICAgIFthdHRyLmFyaWEtYWN0aXZlZGVzY2VuZGFudF09XCJpc09wZW4gPyBpdGVtc0xpc3Q/Lm1hcmtlZEl0ZW0/Lmh0bWxJZCA6IG51bGxcIlxyXG4gICAgICAgICAgICAgICAgICAgYXJpYS1hdXRvY29tcGxldGU9XCJsaXN0XCJcclxuICAgICAgICAgICAgICAgICAgIFthdHRyLmFyaWEtY29udHJvbHNdPVwiaXNPcGVuID8gZHJvcGRvd25JZCA6IG51bGxcIj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG5cclxuICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJsb2FkaW5nXCI+XHJcbiAgICAgICAgPG5nLXRlbXBsYXRlICNkZWZhdWx0TG9hZGluZ1NwaW5uZXJUZW1wbGF0ZT5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm5nLXNwaW5uZXItbG9hZGVyXCI+PC9kaXY+XHJcbiAgICAgICAgPC9uZy10ZW1wbGF0ZT5cclxuXHJcbiAgICAgICAgPG5nLXRlbXBsYXRlXHJcbiAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImxvYWRpbmdTcGlubmVyVGVtcGxhdGUgfHwgZGVmYXVsdExvYWRpbmdTcGlubmVyVGVtcGxhdGVcIj5cclxuICAgICAgICA8L25nLXRlbXBsYXRlPlxyXG4gICAgPC9uZy1jb250YWluZXI+XHJcblxyXG4gICAgPHNwYW4gKm5nSWY9XCJzaG93Q2xlYXIoKVwiIGNsYXNzPVwibmctY2xlYXItd3JhcHBlclwiIHRpdGxlPVwie3tjbGVhckFsbFRleHR9fVwiPlxyXG4gICAgICAgIDxzcGFuIGNsYXNzPVwibmctY2xlYXJcIiBhcmlhLWhpZGRlbj1cInRydWVcIj7Dlzwvc3Bhbj5cclxuICAgIDwvc3Bhbj5cclxuXHJcbiAgICA8c3BhbiBjbGFzcz1cIm5nLWFycm93LXdyYXBwZXJcIj5cclxuICAgICAgICA8c3BhbiBjbGFzcz1cIm5nLWFycm93XCI+PC9zcGFuPlxyXG4gICAgPC9zcGFuPlxyXG48L2Rpdj5cclxuXHJcbjxuZy1kcm9wZG93bi1wYW5lbCAqbmdJZj1cImlzT3BlblwiXHJcbiAgICAgICAgICAgICAgICAgICBjbGFzcz1cIm5nLWRyb3Bkb3duLXBhbmVsXCJcclxuICAgICAgICAgICAgICAgICAgIFt2aXJ0dWFsU2Nyb2xsXT1cInZpcnR1YWxTY3JvbGxcIlxyXG4gICAgICAgICAgICAgICAgICAgW2J1ZmZlckFtb3VudF09XCJidWZmZXJBbW91bnRcIlxyXG4gICAgICAgICAgICAgICAgICAgW2FwcGVuZFRvXT1cImFwcGVuZFRvXCJcclxuICAgICAgICAgICAgICAgICAgIFtwb3NpdGlvbl09XCJkcm9wZG93blBvc2l0aW9uXCJcclxuICAgICAgICAgICAgICAgICAgIFtoZWFkZXJUZW1wbGF0ZV09XCJoZWFkZXJUZW1wbGF0ZVwiXHJcbiAgICAgICAgICAgICAgICAgICBbZm9vdGVyVGVtcGxhdGVdPVwiZm9vdGVyVGVtcGxhdGVcIlxyXG4gICAgICAgICAgICAgICAgICAgW2ZpbHRlclZhbHVlXT1cInNlYXJjaFRlcm1cIlxyXG4gICAgICAgICAgICAgICAgICAgW2l0ZW1zXT1cIml0ZW1zTGlzdC5maWx0ZXJlZEl0ZW1zXCJcclxuICAgICAgICAgICAgICAgICAgIFttYXJrZWRJdGVtXT1cIml0ZW1zTGlzdC5tYXJrZWRJdGVtXCJcclxuICAgICAgICAgICAgICAgICAgICh1cGRhdGUpPVwidmlld1BvcnRJdGVtcyA9ICRldmVudFwiXHJcbiAgICAgICAgICAgICAgICAgICAoc2Nyb2xsKT1cInNjcm9sbC5lbWl0KCRldmVudClcIlxyXG4gICAgICAgICAgICAgICAgICAgKHNjcm9sbFRvRW5kKT1cInNjcm9sbFRvRW5kLmVtaXQoJGV2ZW50KVwiXHJcbiAgICAgICAgICAgICAgICAgICAob3V0c2lkZUNsaWNrKT1cImNsb3NlKClcIlxyXG4gICAgICAgICAgICAgICAgICAgW2NsYXNzLm5nLXNlbGVjdC1tdWx0aXBsZV09XCJtdWx0aXBsZVwiXHJcbiAgICAgICAgICAgICAgICAgICBbbmdDbGFzc109XCJhcHBlbmRUbyA/IGNsYXNzZXMgOiBudWxsXCJcclxuICAgICAgICAgICAgICAgICAgIFtpZF09XCJkcm9wZG93bklkXCJcclxuICAgICAgICAgICAgICAgICAgIHJvbGU9XCJsaXN0Ym94XCJcclxuICAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJPcHRpb25zIGxpc3RcIj5cclxuXHJcbiAgICA8bmctY29udGFpbmVyPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJuZy1vcHRpb25cIiBbYXR0ci5yb2xlXT1cIml0ZW0uY2hpbGRyZW4gPyAnZ3JvdXAnIDogJ29wdGlvbidcIiAoY2xpY2spPVwidG9nZ2xlSXRlbShpdGVtKVwiIChtb3VzZW92ZXIpPVwib25JdGVtSG92ZXIoaXRlbSlcIlxyXG4gICAgICAgICAgICAgICAgKm5nRm9yPVwibGV0IGl0ZW0gb2Ygdmlld1BvcnRJdGVtczsgdHJhY2tCeTogdHJhY2tCeU9wdGlvblwiXHJcbiAgICAgICAgICAgICAgICBbY2xhc3Mubmctb3B0aW9uLWRpc2FibGVkXT1cIml0ZW0uZGlzYWJsZWRcIlxyXG4gICAgICAgICAgICAgICAgW2NsYXNzLm5nLW9wdGlvbi1zZWxlY3RlZF09XCJpdGVtLnNlbGVjdGVkXCJcclxuICAgICAgICAgICAgICAgIFtjbGFzcy5uZy1vcHRncm91cF09XCJpdGVtLmNoaWxkcmVuXCJcclxuICAgICAgICAgICAgICAgIFtjbGFzcy5uZy1vcHRpb25dPVwiIWl0ZW0uY2hpbGRyZW5cIlxyXG4gICAgICAgICAgICAgICAgW2NsYXNzLm5nLW9wdGlvbi1jaGlsZF09XCIhIWl0ZW0ucGFyZW50XCJcclxuICAgICAgICAgICAgICAgIFtjbGFzcy5uZy1vcHRpb24tbWFya2VkXT1cIml0ZW0gPT09IGl0ZW1zTGlzdC5tYXJrZWRJdGVtXCJcclxuICAgICAgICAgICAgICAgIFthdHRyLmFyaWEtc2VsZWN0ZWRdPVwiaXRlbS5zZWxlY3RlZFwiXHJcbiAgICAgICAgICAgICAgICBbYXR0ci5pZF09XCJpdGVtPy5odG1sSWRcIj5cclxuXHJcbiAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSAjZGVmYXVsdE9wdGlvblRlbXBsYXRlPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJuZy1vcHRpb24tbGFiZWxcIiBbbmdJdGVtTGFiZWxdPVwiaXRlbS5sYWJlbFwiIFtlc2NhcGVdPVwiZXNjYXBlSFRNTFwiPjwvc3Bhbj5cclxuICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cclxuXHJcbiAgICAgICAgICAgIDxuZy10ZW1wbGF0ZVxyXG4gICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwiaXRlbS5jaGlsZHJlbiA/IChvcHRncm91cFRlbXBsYXRlIHx8IGRlZmF1bHRPcHRpb25UZW1wbGF0ZSkgOiAob3B0aW9uVGVtcGxhdGUgfHwgZGVmYXVsdE9wdGlvblRlbXBsYXRlKVwiXHJcbiAgICAgICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyBpdGVtOiBpdGVtLnZhbHVlLCBpdGVtJDppdGVtLCBpbmRleDogaXRlbS5pbmRleCwgc2VhcmNoVGVybTogc2VhcmNoVGVybSB9XCI+XHJcbiAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJuZy1vcHRpb25cIiBbY2xhc3Mubmctb3B0aW9uLW1hcmtlZF09XCIhaXRlbXNMaXN0Lm1hcmtlZEl0ZW1cIiAobW91c2VvdmVyKT1cIml0ZW1zTGlzdC51bm1hcmtJdGVtKClcIiByb2xlPVwib3B0aW9uXCIgKGNsaWNrKT1cInNlbGVjdFRhZygpXCIgKm5nSWY9XCJzaG93QWRkVGFnXCI+XHJcbiAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSAjZGVmYXVsdFRhZ1RlbXBsYXRlPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4+PHNwYW4gY2xhc3M9XCJuZy10YWctbGFiZWxcIj57e2FkZFRhZ1RleHR9fTwvc3Bhbj5cInt7c2VhcmNoVGVybX19XCI8L3NwYW4+XHJcbiAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XHJcblxyXG4gICAgICAgICAgICA8bmctdGVtcGxhdGVcclxuICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cInRhZ1RlbXBsYXRlIHx8IGRlZmF1bHRUYWdUZW1wbGF0ZVwiXHJcbiAgICAgICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyBzZWFyY2hUZXJtOiBzZWFyY2hUZXJtIH1cIj5cclxuICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvbmctY29udGFpbmVyPlxyXG5cclxuICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJzaG93Tm9JdGVtc0ZvdW5kKClcIj5cclxuICAgICAgICA8bmctdGVtcGxhdGUgI2RlZmF1bHROb3RGb3VuZFRlbXBsYXRlPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibmctb3B0aW9uIG5nLW9wdGlvbi1kaXNhYmxlZFwiPnt7bm90Rm91bmRUZXh0fX08L2Rpdj5cclxuICAgICAgICA8L25nLXRlbXBsYXRlPlxyXG5cclxuICAgICAgICA8bmctdGVtcGxhdGVcclxuICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwibm90Rm91bmRUZW1wbGF0ZSB8fCBkZWZhdWx0Tm90Rm91bmRUZW1wbGF0ZVwiXHJcbiAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7IHNlYXJjaFRlcm06IHNlYXJjaFRlcm0gfVwiPlxyXG4gICAgICAgIDwvbmctdGVtcGxhdGU+XHJcbiAgICA8L25nLWNvbnRhaW5lcj5cclxuXHJcbiAgICA8bmctY29udGFpbmVyICpuZ0lmPVwic2hvd1R5cGVUb1NlYXJjaCgpXCI+XHJcbiAgICAgICAgPG5nLXRlbXBsYXRlICNkZWZhdWx0VHlwZVRvU2VhcmNoVGVtcGxhdGU+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJuZy1vcHRpb24gbmctb3B0aW9uLWRpc2FibGVkXCI+e3t0eXBlVG9TZWFyY2hUZXh0fX08L2Rpdj5cclxuICAgICAgICA8L25nLXRlbXBsYXRlPlxyXG5cclxuICAgICAgICA8bmctdGVtcGxhdGVcclxuICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwidHlwZVRvU2VhcmNoVGVtcGxhdGUgfHwgZGVmYXVsdFR5cGVUb1NlYXJjaFRlbXBsYXRlXCI+XHJcbiAgICAgICAgPC9uZy10ZW1wbGF0ZT5cclxuICAgIDwvbmctY29udGFpbmVyPlxyXG5cclxuICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJsb2FkaW5nICYmIGl0ZW1zTGlzdC5maWx0ZXJlZEl0ZW1zLmxlbmd0aCA9PT0gMFwiPlxyXG4gICAgICAgIDxuZy10ZW1wbGF0ZSAjZGVmYXVsdExvYWRpbmdUZXh0VGVtcGxhdGU+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJuZy1vcHRpb24gbmctb3B0aW9uLWRpc2FibGVkXCI+e3tsb2FkaW5nVGV4dH19PC9kaXY+XHJcbiAgICAgICAgPC9uZy10ZW1wbGF0ZT5cclxuXHJcbiAgICAgICAgPG5nLXRlbXBsYXRlXHJcbiAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImxvYWRpbmdUZXh0VGVtcGxhdGUgfHwgZGVmYXVsdExvYWRpbmdUZXh0VGVtcGxhdGVcIlxyXG4gICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyBzZWFyY2hUZXJtOiBzZWFyY2hUZXJtIH1cIj5cclxuICAgICAgICA8L25nLXRlbXBsYXRlPlxyXG4gICAgPC9uZy1jb250YWluZXI+XHJcblxyXG48L25nLWRyb3Bkb3duLXBhbmVsPlxyXG4iXX0=