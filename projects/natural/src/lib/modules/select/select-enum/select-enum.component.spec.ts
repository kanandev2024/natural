// tslint:disable:directive-class-suffix
import {Component, Directive} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {
    NaturalEnumService,
    NaturalHierarchicSelectorModule,
    NaturalIconModule,
    NaturalSelectComponent,
    NaturalSelectEnumComponent,
    NaturalSelectModule,
} from '@ecodev/natural';
import {AnyEnumService} from '../../../testing/any-enum.service';
import {MockApolloProvider} from '../../../testing/mock-apollo.provider';
import {hasMatError, TestFixture, TestHostComponent} from '../testing/utils';

@Component({
    template: `
        <natural-select-enum
            enumName="FooEnum"
            [required]="required"
            [disabled]="disabled"
            (selectionChange)="onSelection($event)"
            (blur)="onBlur()"
            [(ngModel)]="myValue"
            placeholder="ngModel"
        ></natural-select-enum>
    `,
})
class TestHostWithNgModelComponent extends TestHostComponent {
    public myValue: any;
    public disabled = false;

    public getDisabled(): boolean {
        return this.disabled;
    }

    public setDisabled(disabled: boolean): void {
        this.disabled = disabled;
    }

    public getValue(): any {
        return this.myValue;
    }

    public setValue(value: any): void {
        this.myValue = value;
    }
}

@Component({
    template: `
        <natural-select-enum
            enumName="FooEnum"
            (selectionChange)="onSelection($event)"
            (blur)="onBlur()"
            [formControl]="formControl"
            placeholder="formControl"
        ></natural-select-enum>
    `,
})
class TestHostWithFormControlComponent extends TestHostComponent {
    public formControl = new FormControl();

    public getDisabled(): boolean {
        return this.formControl.disabled;
    }

    public setDisabled(disabled: boolean): void {
        if (disabled) {
            this.formControl.disable();
        } else {
            this.formControl.enable();
        }
    }

    public getValue(): any {
        return this.formControl.value;
    }

    public setValue(value: any): void {
        this.formControl.setValue(value);
    }
}
describe('NaturalSelectEnumComponent', () => {
    const data: TestFixture = {
        hostComponent: null as any,
        selectComponent: null as any,
        fixture: null as any,
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                FormsModule,
                ReactiveFormsModule,
                NaturalSelectModule,
                NaturalHierarchicSelectorModule,
                NaturalIconModule.forRoot({}),
            ],
            declarations: [TestHostWithNgModelComponent, TestHostWithFormControlComponent],
            providers: [
                {
                    provide: NaturalEnumService,
                    useClass: AnyEnumService,
                },
                MockApolloProvider,
            ],
        }).compileComponents();
    }));

    describe('with ngModel', () => {
        beforeEach(() => {
            data.fixture = TestBed.createComponent(TestHostWithNgModelComponent);
            data.hostComponent = data.fixture.componentInstance;
            data.selectComponent = data.fixture.debugElement.query(By.directive(NaturalSelectEnumComponent)).context;
            data.fixture.detectChanges();
        });

        testOneComponent(data);

        it(`should show error if required and blurred`, () => {
            expect(hasMatError(data)).toBeFalse();

            data.hostComponent.required = true;

            // Should not have error yet because not touched
            data.fixture.detectChanges();
            expect(hasMatError(data)).toBeFalse();

            const input: HTMLElement = data.fixture.debugElement.query(By.css('mat-select')).nativeElement;

            // Touch the element
            input.dispatchEvent(new Event('focus'));
            input.dispatchEvent(new Event('blur'));

            // Now should have error
            data.fixture.detectChanges();
            expect(hasMatError(data)).toBeTrue();
        });
    });

    describe('with formControl', () => {
        beforeEach(() => {
            data.fixture = TestBed.createComponent(TestHostWithFormControlComponent);
            data.hostComponent = data.fixture.componentInstance;
            data.selectComponent = data.fixture.debugElement.query(By.directive(NaturalSelectEnumComponent)).context;
            data.fixture.detectChanges();
        });

        testOneComponent(data);
    });
});

function testOneComponent(data: TestFixture): void {
    it('should create the select', () => {
        expect(data.selectComponent).toBeTruthy();
    });

    it('should change value', () => {
        data.hostComponent.setValue('new value');
        data.fixture.detectChanges();

        expect(data.hostComponent.getValue()).toBe('new value');
    });

    it('should emit blur when internal input emit blur', () => {
        expect(data.hostComponent.blurred).toBe(0);
        const input: HTMLElement = data.fixture.debugElement.query(By.css('mat-select')).nativeElement;

        input.dispatchEvent(new Event('blur'));
        expect(data.hostComponent.blurred).toBe(1);
    });

    it(`should be disabled-able`, () => {
        expect(data.hostComponent.getDisabled()).toBeFalse();

        data.hostComponent.setDisabled(true);

        // Should not have error yet because not touched
        data.fixture.detectChanges();
        expect(data.hostComponent.getDisabled()).toBeTrue();

        const input = data.fixture.debugElement.query(By.css('mat-select.mat-select-disabled'));
        expect(input).not.toBeNull();
    });

    it(`a single option should be disabled-able`, () => {
        // Set disabled option
        const selectComponent: NaturalSelectEnumComponent = data.fixture.debugElement.query(
            By.directive(NaturalSelectEnumComponent),
        ).context;
        selectComponent.optionDisabled = item => item.value === 'val2';

        // Open the mat-select
        const matSelect = data.fixture.debugElement.query(By.css('.mat-select-trigger')).nativeElement;
        matSelect.click();
        data.fixture.detectChanges();

        const disabledOptions = data.fixture.debugElement.queryAll(By.css('.mat-option-disabled'));
        expect(disabledOptions.length).toBe(1);
    });
}
