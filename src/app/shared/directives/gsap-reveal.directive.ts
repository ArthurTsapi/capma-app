import { Directive, ElementRef, Input, AfterViewInit, OnDestroy } from '@angular/core';


@Directive({
  selector: '[gsapReveal]',
  standalone: true
})
export class GsapRevealDirective implements AfterViewInit, OnDestroy {
  @Input('gsapReveal') options: any = {};
  private ctx: any;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    // Avoid running GSAP on server during SSR
    if (typeof window === 'undefined') return;

    (async () => {
      try {
        const gsap = (await import('gsap')).gsap ?? (await import('gsap'));
        const ScrollTriggerMod = await import('gsap/ScrollTrigger');
        const ScrollTrigger = ScrollTriggerMod.ScrollTrigger ?? ScrollTriggerMod.default ?? ScrollTriggerMod;
        if (gsap && ScrollTrigger && typeof gsap.registerPlugin === 'function') {
          gsap.registerPlugin(ScrollTrigger);
        }

        const defaults = { y: 20, duration: 0.8, opacity: 0, ease: 'power3.out' };
        const opts = { ...defaults, ...this.options };

        this.ctx = gsap.context(() => {
          gsap.from(this.el.nativeElement, {
            y: opts.y,
            opacity: opts.opacity,
            duration: opts.duration,
            ease: opts.ease,
            scrollTrigger: {
              trigger: this.el.nativeElement,
              start: 'top 80%'
            }
          });
        }, this.el.nativeElement);
      } catch (e) {
        // If GSAP couldn't load, silently ignore so SSR/build doesn't fail
        // console.warn('GSAP dynamic import failed', e);
      }
    })();
  }

  ngOnDestroy(): void {
    if (this.ctx) this.ctx.revert();
  }
}
