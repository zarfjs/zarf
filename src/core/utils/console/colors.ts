// @TODO: Read through the env vars
const enabled = true

interface Code {
    open: string;
    close: string;
    regexp: RegExp;
}

const code = (open: number[], close: number): Code => {
    return {
      open: `\x1b[${open.join(";")}m`,
      close: `\x1b[${close}m`,
      regexp: new RegExp(`\\x1b\\[${close}m`, "g"),
    };
}
const style = (str: string, code: Code) =>  enabled ? `${code.open}${str.replace(code.regexp, code.open)}${code.close}` : str;

/** Color presets for `console` */
export const bold = (str: string) => style(str, code([1], 22))
export const dim = (str: string) => style(str, code([2], 22))
export const italic = (str: string) => style(str, code([3], 23))
export const underline = (str: string) => style(str, code([4], 24))
export const inverse = (str: string) => style(str, code([7], 27))
export const hidden = (str: string) => style(str, code([8], 28))
export const strikethrough = (str: string) => style(str, code([9], 29))
export const black = (str: string) => style(str, code([30], 39))
export const red = (str: string) => style(str, code([31], 39))
export const green = (str: string) => style(str, code([32], 39))
export const yellow = (str: string) => style(str, code([33], 39))
export const blue = (str: string) => style(str, code([34], 39))
export const magenta = (str: string) => style(str, code([35], 39))
export const cyan = (str: string) => style(str, code([36], 39))
export const white = (str: string) => style(str, code([37], 39))
export const gray = (str: string) => brightBlack(str)

export const brightBlack = (str: string) => style(str, code([90], 39))
export const brightRed = (str: string) => style(str, code([91], 39))
export const brightGreen = (str: string) => style(str, code([92], 39))
export const brightYellow = (str: string) => style(str, code([93], 39))
export const brightBlue = (str: string) => style(str, code([94], 39))
export const brightMagenta = (str: string) => style(str, code([95], 39))
export const brightCyan = (str: string) => style(str, code([96], 39))
export const brightWhite = (str: string) => style(str, code([97], 39))

export const bgBlack = (str: string) => style(str, code([40], 49))
export const bgRed = (str: string) => style(str, code([41], 49))
export const bgGreen = (str: string) => style(str, code([42], 49))
export const bgYellow = (str: string) => style(str, code([43], 49))
export const bgBlue = (str: string) => style(str, code([44], 49))
export const bgMagenta = (str: string) => style(str, code([45], 49))
export const bgCyan = (str: string) => style(str, code([46], 49))
export const bgWhite = (str: string) => style(str, code([47], 49))
export const bgBrightBlack = (str: string) => style(str, code([100], 49))
export const bgBrightRed = (str: string) => style(str, code([101], 49))
export const bgBrightGreen = (str: string) => style(str, code([102], 49))
export const bgBrightYellow = (str: string) => style(str, code([103], 49))
export const bgBrightBlue = (str: string) => style(str, code([104], 49))
export const bgBrightMagenta = (str: string) => style(str, code([105], 49))
export const bgBrightCyan = (str: string) => style(str, code([106], 49))
export const bgBrightWhite = (str: string) => style(str, code([107], 49))
