export const ARROW_REVERSE_MAP: Record<string, string> = {
    '--|>': '<|--',
    '<|--': '--|>',
    '..|>': '<|..',
    '<|..': '..|>',
    '-->': '<--',
    '<--': '-->',
    '..>': '<..',
    '<..': '..>',
    '--*': '*--',
    '*--': '--*',
    '--o': 'o--',
    'o--': '--o',
};

export const SUPPORTED_ARROWS = Object.keys(ARROW_REVERSE_MAP).sort((a, b) => b.length - a.length);