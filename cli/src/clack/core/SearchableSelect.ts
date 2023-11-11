import color from 'picocolors';
import { SelectPrompt } from '@clack/core';
import { select } from '@clack/prompts';
import { Readable, Writable } from 'stream';

// export interface SelectSearchOptions extends SelectOptions<{ value: string; label: string; hint?: string }[], string> {
//     searchPlaceholder?: string;
//     options: { value: string; label: string; hint?: string }[];
// }

// select

interface PromptOptions<Self extends Prompt> {
    render(this: Omit<Self, 'prompt'>): string | void;
    placeholder?: string;
    initialValue?: any;
    validate?: ((value: any) => string | void) | undefined;
    input?: Readable;
    output?: Writable;
    debug?: boolean;
}
type State = 'initial' | 'active' | 'cancel' | 'submit' | 'error';
declare class Prompt {
    protected input: Readable;
    protected output: Writable;
    private rl;
    private opts;
    private _track;
    private _render;
    protected _cursor: number;
    state: State;
    value: any;
    error: string;
    constructor({ render, input, output, ...opts }: PromptOptions<Prompt>, trackValue?: boolean);
    prompt(): Promise<string | symbol>;
    private subscribers;
    on(event: string, cb: (...args: any) => any): void;
    once(event: string, cb: (...args: any) => any): void;
    emit(event: string, ...data: any[]): void;
    private unsubscribe;
    private onKeypress;
    protected close(): void;
    private restoreCursor;
    private _prevFrame;
    private render;
}

export interface SelectSearchOptions<T extends { value: string, label: string, hint?: string }> extends PromptOptions<SelectSearchPrompt<T>> {
    options: T[];
    initialValue?: T['value'];
}

export default class SelectSearchPrompt<T extends {
    value: string
    label: string
    hint?: string
}> extends Prompt {
    searchValueRaw = '';
    searchValueStyled = '';
    selectedOptionIndex = 0;
    matchingOptions: T[];
    selectedOption: T;
    // matchingOptions: { value: string; label: string; hint?: string }[];
    // selectedOption: { value: string; label: string; hint?: string };

    get cursor() {
        return this._cursor;
    }

    constructor(opts: SelectSearchOptions<T>) {
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
