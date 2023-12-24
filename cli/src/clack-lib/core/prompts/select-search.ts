import Prompt, { PromptOptions } from './prompt.js';

interface SelectOptions<T extends { value: any }> extends PromptOptions<SearchSelectPrompt<T>> {
    options: T[];
    initialValue?: T['value'];
}
export default class SearchSelectPrompt<T extends { value: any }> extends Prompt {
    options: T[];
    cursor: number = 0;
    baseOptions: T[];
    prevData: string = '';

    private get _value() {
        return this.options[this.cursor];
    }

    private changeValue(fallback: string = '') {
        if (!this._value) {
            this.value = fallback;
            this.options[this.cursor] = { label: fallback, value: fallback } as any
            return;
        }
        this.value = this._value.value;
    }

    constructor(opts: SelectOptions<T>) {
        super(opts, true);

        this.options = opts.options;
        this.baseOptions = [...this.options]
        this.cursor = this.options.findIndex(({ value }) => value === opts.initialValue);
        if (this.cursor === -1) this.cursor = 0;
        this.changeValue();

        this.on('cursor', (key) => {
            switch (key) {
                case 'left':
                case 'up':
                    this.cursor = this.cursor === 0 ? this.options.length - 1 : this.cursor - 1;
                    break;
                case 'down':
                case 'right':
                    this.cursor = this.cursor === this.options.length - 1 ? 0 : this.cursor + 1;
                    break;
            }
            this.changeValue();
        });

        this.on('value', (data) => {
            // if (!data) return
            if (this.prevData === data) return
            this.prevData = data
            // console.log("VALUE", data, !!data)
            const filtered = this.baseOptions.filter((option) => {
                return option.value.toLowerCase().includes(data.toLowerCase());
            });
            // this.cursor = filtered.length > 0 ? this.options.indexOf(filtered[0]) : 0;
            this.cursor = this.cursor > filtered.length - 1 ? 0 : this.cursor;
            this.options = [...filtered]
            this.changeValue(data);
        })
    }
}
