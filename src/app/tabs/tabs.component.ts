import { Component, ContentChildren, QueryList, AfterContentInit, Output, EventEmitter } from '@angular/core';
import { TabComponent } from './tab/tab.component';

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.css']
})

export class TabsComponent implements AfterContentInit {
    @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;
    @Output() closedTab = new EventEmitter<number>();

    // contentChildren are set
    ngAfterContentInit() {
        // get all active tabs
        let activeTabs = this.tabs.filter((tab) => tab.active);
        // if there is no active tab set, activate the first

        const activeTabIndex: number = +localStorage.getItem('activeTabIndex');
        if (activeTabs.length === 0 && !activeTabIndex) {
            this.selectTab(this.tabs.first, 0);
        } else {
            this.selectTab(this.tabs.filter((element, index) => index === activeTabIndex)[0], activeTabIndex);
        }
    }

    selectTab(tab: TabComponent, i: number) {
        // deactivate all tabs
        localStorage.setItem('activeTabIndex', JSON.stringify(i));
        this.tabs.toArray().forEach(tab => tab.active = false);
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
