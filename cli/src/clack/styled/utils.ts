import isUnicodeSupported from 'is-unicode-supported'
import color from 'picocolors'
import * as pcore from '@clack/core'

const unicode = isUnicodeSupported();
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

export const symbol = (state: pcore.State) => {
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


export interface LimitOptionsParams<TOption> {
    options: TOption[];
    maxItems: number | undefined;
    cursor: number;
    style: (option: TOption, active: boolean) => string;
}

export const limitOptions = <TOption>(params: LimitOptionsParams<TOption>): string[] => {
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
