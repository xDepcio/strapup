import * as pcore from '@clack/core';
import color from 'picocolors';
import SearchableSelect from '../core/SearchableSelect.js';
import { S_BAR, S_BAR_END, S_RADIO_ACTIVE, S_RADIO_INACTIVE, symbol } from './utils.js';


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
                    return `${title}${color.gray(S_BAR)}  ${opt(this.options[this.cursor], 'selected')}`;
                case 'cancel':
                    return `${title}${searchValue}${color.gray(S_BAR)}  ${opt(
                        this.options[this.cursor],
                        'cancelled'
                    )}\n${color.gray(S_BAR)}`;
                default: {
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
