var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from 'angular2/angular2';
import { bootstrap } from 'angular2/bootstrap';
// #docregion SlicePipe_string
export let SlicePipeStringExample = class {
    constructor() {
        this.str = 'abcdefghij';
    }
};
SlicePipeStringExample = __decorate([
    Component({
        selector: 'slice-string-example',
        template: `<div>
    <p>{{str}}[0:4]: '{{str | slice:0:4}}' - output is expected to be 'abcd'</p>
    <p>{{str}}[4:0]: '{{str | slice:4:0}}' - output is expected to be ''</p>
    <p>{{str}}[-4]: '{{str | slice:-4}}' - output is expected to be 'ghij'</p>
    <p>{{str}}[-4:-2]: '{{str | slice:-4:-2}}' - output is expected to be 'gh'</p>
    <p>{{str}}[-100]: '{{str | slice:-100}}' - output is expected to be 'abcdefghij'</p>
    <p>{{str}}[100]: '{{str | slice:100}}' - output is expected to be ''</p>
  </div>`
    }), 
    __metadata('design:paramtypes', [])
], SlicePipeStringExample);
// #enddocregion
// #docregion SlicePipe_list
export let SlicePipeListExample = class {
    constructor() {
        this.collection = ['a', 'b', 'c', 'd'];
    }
};
SlicePipeListExample = __decorate([
    Component({
        selector: 'slice-list-example',
        template: `<div>
    <li *ng-for="var i of collection | slice:1:3">{{i}}</li>
  </div>`
    }), 
    __metadata('design:paramtypes', [])
], SlicePipeListExample);
// #enddocregion
export let AppCmp = class {
};
AppCmp = __decorate([
    Component({
        selector: 'example-app',
        directives: [SlicePipeListExample, SlicePipeStringExample],
        template: ` 
    <h1>SlicePipe Examples</h1>
    <slice-list-example></slice-list-example>
    <slice-string-example></slice-string-example>
  `
    }), 
    __metadata('design:paramtypes', [])
], AppCmp);
export function main() {
    bootstrap(AppCmp);
}
//# sourceMappingURL=slice_pipe_example.js.map