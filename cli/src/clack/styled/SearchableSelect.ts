// @ts-nocheck

import SelectSearch from "../core/SearchableSelect.js";
import color from 'picocolors'
import { S_BAR, S_BAR_END, S_RADIO_ACTIVE, S_RADIO_INACTIVE, symbol } from "./utils.js";

export interface SelectSearchOptions {
    message: string;
    searchPlaceholder?: string;
    options: { value: string; label: string; hint?: string }[];
    initialValue?: string;
    validate?: (value: string) => string | void;
}
export const selectsearch = (opts: SelectSearchOptions) => {
    const opt = (option: { value: string; label: string; hint?: string }, state: 'inactive' | 'active' | 'selected' | 'cancelled') => {
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

    return new SelectSearch({
        validate: opts.validate,
        searchPlaceholder: opts.searchPlaceholder,
        initialValue: opts.initialValue,
        options: opts.options,
        render() {
            if (this.matchingOptions.length === 0) this.state = 'error'
            const title = `${color.gray(S_BAR)}\n${symbol(this.state)}  ${opts.message}\n`;
            const searchPlaceholder = opts.searchPlaceholder
                ? color.inverse(opts.searchPlaceholder[0]) + color.dim(opts.searchPlaceholder.slice(1))
                : color.inverse(color.hidden('_'));
            // const value = !this.value ? searchPlaceholder : this.searchValue;
            const value = this.searchValueRaw ? this.searchValueStyled : searchPlaceholder;
            if (this.matchingOptions.length === 0) {
                return `${title.trim()}\n${color.yellow(S_BAR)}  ${value}\n${color.yellow(
                    S_BAR_END
                )}  ${color.yellow("No matching values found.")}\n`;
            }
            switch (this.state) {
                // case 'error':jor.yellow(this.error)}\n`;
                case 'submit':
                    return `${title}${color.gray(S_BAR)}  ${color.dim(this.value || opts.searchPlaceholder)}`;
                case 'cancel':
                    return `${title}${color.gray(S_BAR)}  ${color.strikethrough(
                        color.dim(this.value ?? '')
                    )}${this.value?.trim() ? '\n' + color.gray(S_BAR) : ''}`;
                case 'error':
                default:
                    return `${title}${color.cyan(S_BAR)}  ${value}\n ${this.matchingOptions.map((option, i) => {
                        return `${color.cyan(S_BAR)}  ${opt(option, this.selectedOptionIndex === i ? 'active' : 'inactive')}`;
                        // const isSelected = this.selectedOptionIndex === i;
                        // const isHighlighted = this.cursor === i;
                        // const isLast = i === this.matchingOptions.length - 1;
                        // const prefix = isSelected ? color.cyan('>') : ' ';
                        // const suffix = isHighlighted ? color.cyan('<') : ' ';
                        // const label = `${prefix} ${option.label}${option.hint ? color.dim(` (${option.hint})`) : ''}${suffix}`;
                        // return `${isLast ? color.cyan(S_BAR_END) : color.cyan(S_BAR)}  ${label}`;
                    }).join('\n')}`;
            }
        },
    }).prompt().catch(e => { throw e }) as Promise<string | symbol>;
};
