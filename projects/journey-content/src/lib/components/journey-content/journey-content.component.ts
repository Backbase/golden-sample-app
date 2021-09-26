import { ChangeDetectorRef, Component, ContentChild, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { JourneyContentService } from '../../services/journey-content.service';

@Component({
  selector: 'bb-journey-content',
  templateUrl: './journey-content.component.html',
  styles: []
})
export class JourneyContentComponent implements OnInit {
  // private preTemplateData: any = {};
  public templateData: any = {};

  @Input() contentId = '';

  @ContentChild('wrapper', {static: true}) wrapper: TemplateRef<any> | null = null; 

  @ViewChild('defaultWrapper', {static: true}) defaultWrapper: TemplateRef<any> | null = null;

  get itemTemplate(): TemplateRef<any> | undefined {
    return this._itemTemplate;
  }
  private _itemTemplate: TemplateRef<any> | undefined;

  @Input() 
  set itemTemplate(value: TemplateRef<any> | undefined) {
    this._itemTemplate = value;
  }

  @ContentChild(TemplateRef, {static: true}) 
  set viewTemplate(value: TemplateRef<any>) {
    if (!this._itemTemplate && value) {
      this._itemTemplate = value;
    }
  }
  
  constructor(private journeyContentService: JourneyContentService/*, private cdref: ChangeDetectorRef*/) { }

  ngAfterViewInit() {
    if (!this.wrapper) {
      this.wrapper = this.defaultWrapper;

    }
  }

  ngOnInit(): void {
    this.journeyContentService
    .getContent(this.contentId)
    .subscribe((data: any) => {
      this.templateData = data.record.contentlets[0];
      // this.preTemplateData = data.record.contentlets[0];
    });
  }
  
  // ngAfterContentChecked() {
  //   this.templateData = this.preTemplateData;
  //   this.cdref.detectChanges();  
  // }
}
