import { CurrentConditions } from './current-conditions/current-conditions.type';

export interface ConditionsAndZip {
    zip: string;
    data: CurrentConditions;
}

export interface ConditionsAndZipAndDate extends ConditionsAndZip {
    storedDate: number;
}
