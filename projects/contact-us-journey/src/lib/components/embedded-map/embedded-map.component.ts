import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";

@Component({
    selector: 'bb-embedded-map',
    templateUrl: 'embedded-map.component.html',
    styleUrls: ['embedded-map.component.scss'],
})
export class EmbeddedMapComponent implements OnInit {
    private _url = '';

    @ViewChild('gmap_canvas', { static: true}) gmapCanvas!: ElementRef;
    @ViewChild('mapOuter', { static: true}) mapCanvas!: ElementRef;

    @Input() width: number = 1080;
    @Input() height: number = 200;
    
    private prefixUrl = 'https://maps.google.com/maps?q=';
    private suffixUrl = '&t=&z=15&ie=UTF8&iwloc=&output=embed';
    
    @Input() set address(value: string) {
        this._url = `${this.prefixUrl}${encodeURIComponent(value)}${this.suffixUrl}`;
    }

    get url() {
        return this._url;
    }

    ngOnInit() {
        if (this.gmapCanvas && this.mapCanvas) {
            this.gmapCanvas.nativeElement.style.width = `${this.width}px`;
            this.gmapCanvas.nativeElement.style.height = `${this.height}px`;
            this.mapCanvas.nativeElement.style.width = `${this.width}px`;
            this.mapCanvas.nativeElement.style.height = `${this.height}px`;
        }
    }
}
