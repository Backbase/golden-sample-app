import { Directive, ElementRef, HostListener, Renderer2, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Tracker, UserActionTrackerEvent } from '@backbase/foundation-ang/observability';

class ExternalLinkTrackerEvent extends UserActionTrackerEvent<{ payload: { currentUrl: string; externalUrl: string; xpath: string }}> {
    name = 'external-link-detected';
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'a[href]', // This will target all anchor tags with href attribute
})
export class GlobalLinkHandlerDirective implements OnInit {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private router: Router,
    private tracker: Tracker,
  ) {}

  ngOnInit() {
    // Add target="_blank" to all external links
    const href = this.el.nativeElement.href;
    if (this.isExternalUrl(href)) {
      this.renderer.setAttribute(this.el.nativeElement, 'target', '_blank');
      this.renderer.setAttribute(this.el.nativeElement, 'rel', 'noopener noreferrer');
    }
  }

  getXPath(element: Element): string {
    if (!element) {
      return '';
    }
    
    if (element.id !== '') {
      return `//*[@id="${element.id}"]`;
    }
    
    if (element === document.body) {
      return '/html/body';
    }
  
    let path = '';
    let current: Element | null = element;
    while (current && current.nodeType === Node.ELEMENT_NODE) {
      let index = 0;
      let hasFollowingSiblings = false;
      for (let sibling = current.previousSibling; sibling; sibling = sibling.previousSibling) {
        if (sibling.nodeType === Node.ELEMENT_NODE && sibling.nodeName === current.nodeName) {
          index++;
        }
      }
  
      for (let sibling = current.nextSibling; sibling && !hasFollowingSiblings; sibling = sibling.nextSibling) {
        if (sibling.nodeName === current.nodeName) {
          hasFollowingSiblings = true;
        }
      }
  
      const tagName = current.nodeName.toLowerCase();
      const pathIndex = (index || hasFollowingSiblings) ? `[${index + 1}]` : '';
      path = `/${tagName}${pathIndex}${path}`;
  
      current = current.parentNode as Element;
    }
  
    return path.toLowerCase();
  }

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    const href = this.el.nativeElement.href;
    const xpath = this.getXPath(this.el.nativeElement);

    if (this.isExternalUrl(href)) {
      event.preventDefault();

      // Track external link event before opening external url.
      this.tracker?.publish(new ExternalLinkTrackerEvent({ currentUrl: this.router.url, externalUrl: href, xpath: xpath }));

      // Open external links in a new tab/window
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      // For internal links, prevent default and use Angular router
      event.preventDefault();
      this.router.navigateByUrl(href.replace(window.location.origin, ''));
    }
  }

  private isExternalUrl(url: string): boolean {
    // Check if the URL is absolute and not part of your app
    return /^(http|https):\/\//.test(url) && !url.startsWith(window.location.origin);
  }
}