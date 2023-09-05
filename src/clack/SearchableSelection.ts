import * as pcore from '@clack/core';
import color from 'picocolors';

export const TEMPLATO_DIR_NAME = 'templato'
export const TEMPLATO_DIR_PATH = `/home/olek/${TEMPLATO_DIR_NAME}`
export const WORK_DIR = process.cwd()
export const args = process.argv


// const unicode = isUnicore();
const unicode = true;
const s = (c: string, fallback: string) => (unicode ? c : fallback);
export const S_STEP_ACTIVE = s('◆', '*');
export const S_STEP_CANCEL = s('■', 'x');
export const S_STEP_ERROR = s('▲', 'x');
export const S_STEP_SUBMIT = s('◇', 'o');

export const S_BAR_START = s('┌', 'T');
export const S_BAR = s('│', '|');
export const S_BAR_END = s('└', '—');

export const S_RADIO_ACTIVE = s('●', '>');
export const S_RADIO_INACTIVE = s('○', ' ');
export const S_CHECKBOX_ACTIVE = s('◻', '[•]');
export const S_CHECKBOX_SELECTED = s('◼', '[+]');
export const S_CHECKBOX_INACTIVE = s('◻', '[ ]');
export const S_PASSWORD_MASK = s('▪', '•');

export const S_BAR_H = s('─', '-');
export const S_CORNER_TOP_RIGHT = s('╮', '+');
export const S_CONNECT_LEFT = s('├', '+');
export const S_CORNER_BOTTOM_RIGHT = s('╯', '+');

export const S_INFO = s('●', '•');
export const S_SUCCESS = s('◆', '*');
export const S_WARN = s('▲', '!');
export const S_ERROR = s('■', 'x');

const symbol = (state: pcore.State) => {
    switch (state) {
        case 'initial':
        case 'active':
            return color.cyan(S_STEP_ACTIVE);
        case 'cancel':
            return color.red(S_STEP_CANCEL);
        case 'error':
            return color.yellow(S_STEP_ERROR);
        case 'submit':
            return color.green(S_STEP_SUBMIT);
    }
};

interface LimitOptionsParams<TOption> {
    options: TOption[];
    maxItems: number | undefined;
    cursor: number;
    style: (option: TOption, active: boolean) => string;
}

const limitOptions = <TOption>(params: LimitOptionsParams<TOption>): string[] => {
    const { cursor, options, style } = params;

    // We clamp to minimum 5 because anything less doesn't make sense UX wise
    const maxItems = params.maxItems === undefined ? Infinity : Math.max(params.maxItems, 5);
    let slidingWindowLocation = 0;

    if (cursor >= slidingWindowLocation + maxItems - 3) {
        slidingWindowLocation = Math.max(Math.min(cursor - maxItems + 3, options.length - maxItems), 0);
    } else if (cursor < slidingWindowLocation + 2) {
        slidingWindowLocation = Math.max(cursor - 2, 0);
    }

    const shouldRenderTopEllipsis = maxItems < options.length && slidingWindowLocation > 0;
    const shouldRenderBottomEllipsis =
        maxItems < options.length && slidingWindowLocation + maxItems < options.length;

    return options
        .slice(slidingWindowLocation, slidingWindowLocation + maxItems)
        .map((option, i, arr) => {
            const isTopLimit = i === 0 && shouldRenderTopEllipsis;
            const isBottomLimit = i === arr.length - 1 && shouldRenderBottomEllipsis;
            return isTopLimit || isBottomLimit
                ? color.dim('...')
                : style(option, i + slidingWindowLocation === cursor);
        });
};

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
        // process.stderr.write(`\nCURR_VAL ${this.value}\n`);
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

type Primitive = Readonly<string | boolean | number>;

type Option<Value> = Value extends Primitive
    ? { value: Value; label?: string; hint?: string }
    : { value: Value; label: string; hint?: string };

export interface SelectOptions2<Value> {
    message: string;
    options: Option<Value>[];
    initialValue?: Value;
    maxItems?: number;
}

export const searchselect = <Value>(opts: SelectOptions2<Value>) => {
    const opt = (option: Option<Value>, state: 'inactive' | 'active' | 'selected' | 'cancelled') => {
        const label = option.label ?? String(option.value);
        switch (state) {
            case 'selected':
                return `${color.dim(label)}`;
            case 'active':
                return `${color.green(S_RADIO_ACTIVE)} ${label} ${option.hint ? color.dim(`(${option.hint})`) : ''
                    }`;
            case 'cancelled':
                return `${color.strikethrough(color.dim(label))}`;
            default:
                return `${color.dim(S_RADIO_INACTIVE)} ${color.dim(label)}`;
        }
    };

    return new SearchableSelect({
        options: opts.options,
        initialValue: opts.initialValue,
        render() {
            const title = `${color.gray(S_BAR)}\n${symbol(this.state)}  ${opts.message}\n`;
            const searchValue = `${color.gray(S_BAR)}  ${color.dim(this.search)}${color.inverse(color.hidden('_'))}\n`
            switch (this.state) {
                case 'submit':
                    // return `${inspect(this.options)}${this.cursor}${this.options[this.cursor]}`
                    return `${title}${color.gray(S_BAR)}  ${opt(this.options[this.cursor], 'selected')}`;
                case 'cancel':
                    return `${title}${searchValue}${color.gray(S_BAR)}  ${opt(
                        this.options[this.cursor],
                        'cancelled'
                    )}\n${color.gray(S_BAR)}`;
                default: {
                    // return `${inspect(this.options)}${this.cursor}${title}${searchValue}${color.cyan(S_BAR)}  ${limitOptions({
                    return `${title}${searchValue}${color.cyan(S_BAR)}  ${limitOptions({
                        cursor: this.cursor,
                        options: this.options,
                        maxItems: opts.maxItems,
                        style: (item, active) => opt(item, active ? 'active' : 'inactive'),
                    }).join(`\n${color.cyan(S_BAR)}  `)}\n${color.cyan(S_BAR_END)}\n`;
                }
            }
        },
    }).prompt() as Promise<Value | symbol>;
};
