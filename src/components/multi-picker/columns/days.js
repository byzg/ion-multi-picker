"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require('lodash');
var moment = require('moment');
var multi_picker_columns_1 = require('../multi-picker-columns');
var MultiPickerColumnDays = (function (_super) {
    __extends(MultiPickerColumnDays, _super);
    function MultiPickerColumnDays(attrs) {
        var _this = this;
        _super.call(this, attrs);
        this.name = 'date';
        this.lastOptionValue = 31;
        this.existingDates = {};
        this.customFilterDays = function (month, year) {
            var days = _this.values;
            _this.options = _super.prototype.toOptions.call(_this, (attrs.customFilterDays || _.identity)(days, month, year));
            return _this;
        };
        if (typeof (attrs.weekends) == 'string')
            this.weekends = _.split(attrs.weekends, /[\,\s]+/g).map(function (weekend) { return parseInt(weekend); });
        else if (this.weekends instanceof Array)
            this.weekends = _.map(this.weekends, function (weekend) { return typeof (weekend) == 'number' ? weekend : parseInt(weekend); });
        else
            this.weekends = [];
    }
    MultiPickerColumnDays.prototype.filter = function (month, year) {
        return this.filterDays(month, year).filterWeekends(month, year).customFilterDays(month, year).values;
    };
    MultiPickerColumnDays.prototype.filterDays = function (month, year) {
        if (!this.existingDates[year] || !this.existingDates[year][month]) {
            this.generateOptions();
            var lastMonthDay_1 = this.toMoment(year, month, 1).endOf('month').date();
            var days = this.values;
            this.existingDates[year] = this.existingDates[year] || {};
            this.existingDates[year][month] = _super.prototype.toOptions.call(this, _.filter(days, function (day) { return day <= lastMonthDay_1; }));
        }
        this.options = this.existingDates[year][month];
        return this;
    };
    MultiPickerColumnDays.prototype.filterWeekends = function (month, year) {
        var _this = this;
        if (!_.isEmpty(this.weekends)) {
            var days = this.values;
            this.options = _super.prototype.toOptions.call(this, _.filter(days, function (day) {
                return !_.includes(_this.weekends, _this.toMoment(year, month, day).weekday() || 7);
            }));
        }
        return this;
    };
    MultiPickerColumnDays.prototype.toMoment = function (year, month, day) {
        return moment([year, month - 1, day]);
    };
    return MultiPickerColumnDays;
}(multi_picker_columns_1.MultiPickerColumn));
exports.MultiPickerColumnDays = MultiPickerColumnDays;
