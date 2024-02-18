import { Component, ContentChildren, QueryList, AfterContentInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { TabComponent } from './tab/tab.component';
import { ACTIVE_TAB_INDEX } from 'app/constants/active-tab-index';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.css']
})

export class TabsComponent implements AfterContentInit, OnDestroy {
    @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;
    @Output() closedTab = new EventEmitter<number>();
    @Output() openedTab = new EventEmitter<number>();
    destroy$ = new Subject<boolean>();
    removedTabIndex: number;
    onRemove: boolean;

    // contentChildren are set
    ngAfterContentInit() {
        let activeTabIndex: number = +localStorage.getItem(ACTIVE_TAB_INDEX);
        // get all active tabs
        let activeTabs = this.tabs.filter((tab) => tab.active);
        // if there is no active tab set, activate the first
        if (activeTabs.length === 0 && !activeTabIndex) {
            this.selectTab(this.tabs.first, 0);
        } else {
            this.selectTab(this.tabs.filter((element, index) => index === activeTabIndex)[0], activeTabIndex);
        }

        // listen tabs states
        this.tabs.changes
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                activeTabIndex = +localStorage.getItem(ACTIVE_TAB_INDEX);
                // get tab index after close tab event
                let newTabIndex: number = this.removedTabIndex > activeTabIndex ? activeTabIndex : activeTabIndex - 1;
                // set active tabs for add or close tab event
                const tabsCounter: number = this.onRemove ? newTabIndex : this.tabs.toArray().length - 1;
                setTimeout(() => {
                    this.tabs.toArray().forEach((tab, index) => {
                        if (index === tabsCounter) {
                            this.selectTab(tab, tabsCounter);
                        }
                    });
                });
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    selectTab(tab: TabComponent, i: number) {
        // reset closed tab informations
        this.removedTabIndex = 0;
        this.onRemove = false;
        // store selected tab index
        localStorage.setItem(ACTIVE_TAB_INDEX, JSON.stringify(i));
        // deactivate all tabs
        this.tabs.toArray().forEach(tab => tab.active = false);
        this.openedTab.emit(i);
        // activate the tab the user has clicked on.
        setTimeout(() => {
            // set active tab
            tab.active = true;
        });
    }

    closeTab(tabIndex: number): void {
        this.removedTabIndex = tabIndex;
        this.onRemove = true;
        this.closedTab.emit(tabIndex);
    }
}
