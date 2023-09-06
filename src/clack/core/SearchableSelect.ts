import * as pcore from '@clack/core';

interface SelectOptions<T extends { value: any }> extends pcore.PromptOptions<SearchableSelect<T>> {
    options: T[];
    initialValue?: T['value'];
}

export default class SearchableSelect<T extends { value: any }> extends pcore.Prompt {
    options: T[];
    cursor: number = 0;
    search: string = '';
    savedOptions: T[];

    private get _value() {
        return this.options[this.cursor];
    }

    private changeValue() {
        // this.value = this._value.value;
        const option = this.options[this.cursor]
        if (!option) {
            this.value = undefined
        }
        else {
            this.value = this.options[this.cursor].value
        }
    }

    constructor(opts: SelectOptions<T>) {
        super(opts, false);

        this.options = [...opts.options];
        this.savedOptions = [...opts.options]
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

        this.on('key', (key: string) => {
            if (key.charCodeAt(0) === 13) {
                return
            }
            if (key.charCodeAt(0) === 127) {
                this.search = this.search.slice(0, -1)
                this.options = [...opts.options].filter(option => option.value?.includes(this.search))
            }
            else {
                this.search += key
                this.options = [...opts.options].filter(option => option.value?.includes(this.search))
            }
            this.cursor = 0
            this.changeValue()
        })
    }
}
