// tslint:disable:directive-class-suffix
import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Use
 * import { takeUntil } from 'rxjs/operators';
 * .pipe(takeUntil(this.ngUnsubscribe)) as first pipe on observables that should be destroyed on component destroy
 */
@Directive()
export class NaturalAbstractController implements OnDestroy {

    protected ngUnsubscribe = new Subject<void>();

    constructor() {
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next(); // required or complete() will not emit
        this.ngUnsubscribe.complete(); // unsubscribe everybody
    }

    public back() {
        window.history.back();
    }

}
