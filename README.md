# Ion2-datetime-picker


[![Dependency Status](https://david-dm.org/byzg/ion2-datetime-picker.svg)](https://david-dm.org/byzg/ion2-datetime-picker) [![devDependencies Status](https://david-dm.org/byzg/ion2-datetime-picker/dev-status.svg)](https://david-dm.org/byzg/ion2-datetime-picker?type=dev) [![npm version](https://badge.fury.io/js/ion2-datetime-picker.svg)](https://badge.fury.io/js/ion2-datetime-picker) [![npm download](https://img.shields.io/npm/dm/ion2-datetime-picker.svg)](https://www.npmjs.com/package/ion2-datetime-picker) [![Coverage Status](https://coveralls.io/repos/byzg/ion2-datetime-picker/badge.svg?branch=master)](https://coveralls.io/r/byzg/ion2-datetime-picker?branch=master)

Ion2 Datetime Picker--An Ionic 2+ Custom Datetime Picker Component based on 
[ion-multi-picker](https://github.com/raychenfj/ion-multi-picker) by [raychenfj](https://github.com/raychenfj)

Simulate IOS date and time column pickers by ionic2 picker. Default 
[Ionic DateTime Component](http://ionicframework.com/docs/v2/api/components/datetime/DateTime/) work with 
only independent columns that has some validation problems. Also there is 
[min and max issue](https://github.com/driftyco/ionic/issues/6850) with time validation.
This one helps to solve these problems.

**Note: [MomentJS](http://momentjs.com/) requred for using some features of the package**

Github: [https://github.com/byzg/ion2-datetime-picker](https://github.com/byzg/ion2-datetime-picker)

NPM: [https://www.npmjs.com/package/ion2-datetime-picker](https://www.npmjs.com/package/ion2-datetime-picker)

## Depenencies

[moment](https://www.npmjs.com/package/moment) ^2.19.4

## Demo

Code of this example [here](https://github.com/byzg/ion2-datetime-picker/tree/master/src/pages/advanced)

<img src="./demo.gif?raw=true" alt="Demo">


## Installation
```
npm install ion2-datetime-picker --save
```

## Usage
1.Import MultiPickerModule to your app/module.
```Typescript
import { MultiPickerModule } from 'ion2-datetime-picker';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    MultiPickerModule //Import MultiPickerModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
  ],
  providers: []
})
export class AppModule {}
```
2.Add ion-multi-picker to your html template. 

```html
    <ion-item>
        <ion-label>Simple TimePicker</ion-label>
        <ion-multi-picker item-content></ion-multi-picker>
    </ion-item>
```
**Note: Don't miss the `item-content` attribute**

Like other ionic components, you can use `[formControl]` to bind your data.

```typescript
import { FormBuilder, FormGroup } from '@angular/forms';
...
constructor() {
  this.formGroup = new FormBuilder().group({
    time: [moment().format()]
  });
}
```

```html
	<ion-item>
        <ion-label>Default Value</ion-label>
        <ion-multi-picker item-content [formControl]="formGroup.controls.time"></ion-multi-picker>
    </ion-item>
```

Set `type` to `date` to use datepicker.

```html
    <ion-item>
        <ion-label>Disabled Picker</ion-label>
        <ion-multi-picker item-content type="date" [formControl]="formGroup.controls.date"></ion-multi-picker>
    </ion-item>
```

## Attributes
 
| Attribute | Description | Data type | Values | Picker type | Default|
|-----------|-------------|-----------|--------|-------------|--------|
|item-content|**Required**, add this attribute so that this custom component can be display correctly under `ion-item` tag|  - | - | all | - |
|type| Sets waht to use: date- or timepicker | String | date or time| - | time |
|displayFormat| Format of picked data | String | [moment formats](http://momentjs.com/docs/#/displaying/format/) | all | DD.MM.YYYY HH:mm |
|pickerFormat| Format of picking data. **Note: now supports only months** | String | [moment formats](http://momentjs.com/docs/#/displaying/format/) | date | `displayFormat` |
| min | Validation minimum attribute | ISO 8601 String or moment.Moment |  | time | Beginning of the year, which precedes the current 2 years |
| max | Validation maximum attribute | ISO 8601 String or moment.Moment | | time | End of the year that follows the current 2 years |
| minuteRounding | Minutes will be equal this one or aliquot  | String or Number | 60 must be divisible by this | time | 1 |
| cancelText | Text of picker cancel button | String |  | all | Cancel |
| doneText | Text of picker done button | String | | all | Done |
| weekends | Numbers of days of week that should be disabled on datepicker. Note: Monday is the first day and Sunday is a seventh day | String or Array of string | E.g.: ['6', '7'] | date | [] |
| filterDays | Function like (days, month, year)=> that should return array of day numbers that should NOT be disabled in given month and year | Function | E.g.: (days, month, year)=> days | date | Lodash identity |
| dateContext | By default if initail model value is given then date of min and max setups to date of this model value. But if initail model value is given is not given then date of min and max setups to current date. Set dateContext attribute to change it | ISO 8601 String or moment.Moment | | time | |

## Exceptions
If for some reason, all the possible
 values of the column are non-valid, this exception is raised: 
* `Ion2 datetime picker: column "<column.name> " should have at least one option` - 

## Utils
You can use some utils methods:
```typescript
import { MultiPickerUtils } from 'ion2-datetime-picker';

let variable = MultiPickerUtils.minuteRound('2016-12-10T11:32:44+03:00', 15);
```


* minuteRound(val: string\|moment.Moment, rounding: number): moment.Moment
 
 Returns nearest from below moment for *val* with minutes that multiple for *rounding*

## Contribution

Welcome issue report, PR and contributors. Help me improve it.

Fork and `git clone` this project, 
most code for the multi picker is under `src/app/components/multi-picker`.

The unit test framework is karma + webpack + jasmine. And e2e test is protractor. 

Add your unit test and use `npm test` to start karma.

Debug your unit test using `npm run test-watch` and open `http://localhost:9876/debug.html`

Add your e2e test, run `ionic serve` and then in another terminal use `npm run e2e` to run protractor.

You can also add your use case in the `app/pages`.

Finally, send me a `PULL REQUEST`.

##### Build

`gulp default`
`npm publish`

## License
MIT
