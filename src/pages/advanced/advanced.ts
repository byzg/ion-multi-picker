import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController } from 'ionic-angular';
import moment from 'moment';

@Component({
	templateUrl: 'advanced.html',
})

export class AdvancedExamplePage {
  private formBuilder: FormBuilder = new FormBuilder();
  formGroup: FormGroup = this.formBuilder.group({
    date: [moment().format()],
    time: [moment().format()],
    timeRounded: [moment().format()],
    time12: [moment().format()],
    minTime: [moment('2016-11-30T05:00:00+03:00').format()],
    maxTime: [moment('2016-11-30T14:00:00+03:00').format()]
  });
	constructor(private navCtrl: NavController) {
	}

  filterDays(days: Array<number>, month: number, year: number): number[] {
    return days
  }
}
