#!/usr/bin/env node

import * as fs from 'fs'
import * as afs from 'node:fs/promises'
import { ScriptsNames, list, paste, runScript, save } from './commandsHandlers.js'
import { scripts } from './scripts.js'
import { setTimeout } from 'node:timers/promises';
import color from 'picocolors';
import * as p from '@clack/prompts';
import * as pcore from '@clack/core'
// import { PromptOptions } from '@clack/core'
import { Stream } from 'stream';
import { inspect } from 'util';

export const TEMPLATO_DIR_NAME = 'templato'
export const TEMPLATO_DIR_PATH = `/home/olek/${TEMPLATO_DIR_NAME}`
export const WORK_DIR = process.cwd()
export const args = process.argv


// const unicode = isUnicore();
const unicode = true;
const s = (c: string, fallback: string) => (unicode ? c : fallback);
const S_STEP_ACTIVE = s('◆', '*');
const S_STEP_CANCEL = s('■', 'x');
const S_STEP_ERROR = s('▲', 'x');
const S_STEP_SUBMIT = s('◇', 'o');

const S_BAR_START = s('┌', 'T');
const S_BAR = s('│', '|');
const S_BAR_END = s('└', '—');

const S_RADIO_ACTIVE = s('●', '>');
const S_RADIO_INACTIVE = s('○', ' ');
const S_CHECKBOX_ACTIVE = s('◻', '[•]');
const S_CHECKBOX_SELECTED = s('◼', '[+]');
const S_CHECKBOX_INACTIVE = s('◻', '[ ]');
const S_PASSWORD_MASK = s('▪', '•');

const S_BAR_H = s('─', '-');
const S_CORNER_TOP_RIGHT = s('╮', '+');
const S_CONNECT_LEFT = s('├', '+');
const S_CORNER_BOTTOM_RIGHT = s('╯', '+');

const S_INFO = s('●', '•');
const S_SUCCESS = s('◆', '*');
const S_WARN = s('▲', '!');
const S_ERROR = s('■', 'x');

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


async function main() {
    if (!fs.existsSync(TEMPLATO_DIR_PATH)) {
        await afs.mkdir(`${TEMPLATO_DIR_PATH}/templates`, { recursive: true })
        console.log(`Created ${TEMPLATO_DIR_NAME} directory at ${TEMPLATO_DIR_PATH}`)
    }

    console.clear();
    p.intro(`${color.bgCyan(color.black(' templato '))}`);

    const command = await p.select({
        message: 'What do you want to do?',
        options: [
            { value: 'run-script', label: `${color.underline(color.cyan('run-script'))} - run a script.` },
            { value: 'save', label: `${color.underline(color.cyan('save'))} - save a new template.` },
            { value: 'paste', label: `${color.underline(color.cyan('paste'))} - paste saved template.` },
            { value: 'list', label: `${color.underline(color.cyan('list'))} - lsit saved templates.` },
        ],
    })

    // return

    // const command = args[2]

    switch (command) {
        case 'run-script': {
            const scriptName = args[3]
            if (!scripts.hasOwnProperty(scriptName)) {
                console.log('Script does not exist')
                return
            }
            runScript({ scriptName: scriptName as ScriptsNames })
            break
        }
        case 'save': {
            const templateName = await p.text({
                message: 'What should be the name of the template?',
                placeholder: 'my-template',
                validate: (value) => {
                    if (!value) return 'Please enter a name.'
                    if (value.match(/[^(a-zA-Z_\-)]/)?.length) return 'Please enter a valid name.'
                }
            }) as string

            const sourceRelativePath = await p.text({
                message: 'Specify relative path to the source directory.',
                initialValue: './',
                validate: (value) => {
                    if (!value) return 'Please enter a path.'
                    if (value[0] !== '.') return 'Please enter a relative path.'
                },
            }) as string

            const flags = await p.multiselect({
                message: 'Select additional options.',
                options: [
                    { value: '--with-gitignore', label: `Don't save files which are in this directory .gitignore`, hint: 'make sure you use templato from correct path.' },
                ],
                required: false,
            }) as string[]

            const withGitignore = flags.includes('--with-gitignore')

            await save({ sourceRelativePath, templateName, withGitignore })
            break
        }
        case 'paste': {
            const templates = fs.readdirSync(`${TEMPLATO_DIR_PATH}/templates`)
            if (templates.length == 0) {
                p.log.error(`You don't have any templates saved.`)
                return
            }
            const dd = await mySelect({
                message: 'What template do you want to paste?',
                options: templates.map(template => ({ value: template, label: template })),
            })

            const tt = await p.text({
                message: 'blbla',
            })
            // const templatePrompt = tes({
            //     message: 'What template do you want to paste?',
            // })
            // const res = await templatePrompt.prompt()
            // const templatePrompt = new pcore.TextPrompt({
            //     render: () => {
            //         // @ts-ignore
            //         return `What's your name?\n`;
            //     },
            // }).prompt()
            // const templatePrompt = await p.text({
            //     message: 'What template do you want to paste?',
            // })
            // templatePrompt.on('key', (key) => {
            //     templatePrompt.value = `${key}a`
            //     // @ts-ignore
            //     templatePrompt.render()
            // })
            // await templatePrompt.prompt()
            return
            const templateName = args[3]
            const destinationRelativePath = args[4] || '.'

            paste({
                templateName: templateName,
                destinationRelativePath: destinationRelativePath
            })
            break
        }
        case 'list': {
            list()
        }
        default: {
            console.log('Command not found')
            break
        }
    }

    p.outro(`Problems? ${color.underline(color.cyan('https://example.com/issues'))}`);
}


main().catch(console.error);



interface SelectOptions<T extends { value: any }> extends pcore.PromptOptions<MySelectPrompt<T>> {
    options: T[];
    initialValue?: T['value'];
}
export default class MySelectPrompt<T extends { value: any }> extends pcore.Prompt {
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

export const mySelect = <Value>(opts: SelectOptions2<Value>) => {
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

    return new MySelectPrompt({
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
