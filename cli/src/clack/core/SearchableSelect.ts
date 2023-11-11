// @ts-nocheck
import color from 'picocolors';
import { Prompt, PromptOptions } from '@clack/core'

export interface SelectSearchOptions extends PromptOptions<SelectSearch> {
    searchPlaceholder?: string;
    options: { value: string; label: string; hint?: string }[];
}

export default class SelectSearch extends Prompt {
    searchValueRaw = '';
    searchValueStyled = '';
    selectedOptionIndex = 0;
    matchingOptions: { value: string; label: string; hint?: string }[];
    selectedOption: { value: string; label: string; hint?: string };

    get cursor() {
        return this._cursor;
    }

    constructor(opts: SelectSearchOptions) {
        super(opts);

        this.matchingOptions = [...opts.options];
        this.selectedOption = this.matchingOptions[0];

        this.on('finalize', () => {
            if (!this.selectedOption) {
                this.state = 'error';
                this.matchingOptions = [...opts.options]
                this.searchValueRaw = '';
                this.searchValueStyled = '';
                this.value = ''
            }
            else {
                this.value = this.selectedOption.value;
            }
        });
        this.on('value', () => {
            if (this.cursor >= this.value.length) {
                this.searchValueStyled = `${this.value}${color.inverse(color.hidden('_'))}`;
            } else {
                const s1 = this.value.slice(0, this.cursor);
                const s2 = this.value.slice(this.cursor);
                this.searchValueStyled = `${s1}${color.inverse(s2[0])}${s2.slice(1)}`;
            }
            this.searchValueRaw = this.value;
            this.matchingOptions = opts.options.filter((option) => option.label.includes(this.value));

            if (this.matchingOptions[this.selectedOptionIndex] === undefined) {
                this.selectedOptionIndex = 0;
                this.selectedOption = this.matchingOptions[this.selectedOptionIndex];
            }
        });

        this.on('cursor', (key) => {
            switch (key) {
                case 'left':
                case 'up':
                    this.selectedOptionIndex = this.selectedOptionIndex === 0 ? this.matchingOptions.length - 1 : this.selectedOptionIndex - 1;
                    break;
                case 'down':
                case 'right':
                    this.selectedOptionIndex = this.selectedOptionIndex === this.matchingOptions.length - 1 ? 0 : this.selectedOptionIndex + 1;
                    break;
            }
            this.selectedOption = this.matchingOptions[this.selectedOptionIndex];
        });
    }
}
