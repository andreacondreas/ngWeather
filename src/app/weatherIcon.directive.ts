import { Directive, Renderer2, ElementRef, Input } from '@angular/core';
import { environment } from 'environments/environment';
@Directive({
    selector: '[weatherIcon]'
})
export class WeatherIconDirective {

    @Input()
    set id(value: number) {
        const src: string = this.getWeatherIcon(value);
        this.renderer.setAttribute(this.el.nativeElement, 'src', src);
    }

    constructor(private renderer: Renderer2, private el: ElementRef) {
    }

    getWeatherIcon(id): string {
        if (id >= 200 && id <= 232)
            return environment.ICON_URL + "art_storm.png";
        else if (id >= 501 && id <= 511)
            return environment.ICON_URL + "art_rain.png";
        else if (id === 500 || (id >= 520 && id <= 531))
            return environment.ICON_URL + "art_light_rain.png";
        else if (id >= 600 && id <= 622)
            return environment.ICON_URL + "art_snow.png";
        else if (id >= 801 && id <= 804)
            return environment.ICON_URL + "art_clouds.png";
        else if (id === 741 || id === 761)
            return environment.ICON_URL + "art_fog.png";
        else
            return environment.ICON_URL + "art_clear.png";
    }
}