import { Component, ContentChildren, QueryList, AfterContentInit, Output, EventEmitter } from '@angular/core';
import { TabComponent } from './tab/tab.component';
import { ACTIVE_TAB_INDEX } from 'app/constants/active-tab-index';

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.css']
})

export class TabsComponent implements AfterContentInit {
    @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;
    @Output() closedTab = new EventEmitter<number>();
    @Output() openedTab = new EventEmitter<number>();

    // contentChildren are set
    ngAfterContentInit() {
        // get all active tabs
        let activeTabs = this.tabs.filter((tab) => tab.active);
        // if there is no active tab set, activate the first

        const activeTabIndex: number = +localStorage.getItem(ACTIVE_TAB_INDEX);
        if (activeTabs.length === 0 && !activeTabIndex) {
            this.selectTab(this.tabs.first, 0);
        } else {
            this.selectTab(this.tabs.filter((element, index) => index === activeTabIndex)[0], activeTabIndex);
        }
    }

    selectTab(tab: TabComponent, i: number) {
        // deactivate all tabs
        localStorage.setItem(ACTIVE_TAB_INDEX, JSON.stringify(i));
        this.tabs.toArray().forEach(tab => tab.active = false);
        this.openedTab.emit(i);
        // activate the tab the user has clicked on.
        setTimeout(() => {
            tab.active = true;
        });
    }

    closeTab(tabIndex: number): void {
        this.closedTab.emit(tabIndex);
        setTimeout(() => {
            this.selectTab(this.tabs.first, 0);
        });
    }
}
