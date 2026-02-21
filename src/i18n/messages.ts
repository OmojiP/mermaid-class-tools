export type Locale = 'ja' | 'en';

export type LocaleMessages = {
    quickFix: {
        reverseArrowOnly: string;
        reverseDirectionOnly: string;
        reverseArrowAndDirection: string;
    };
    hover: {
        title: string;
        arrowDescriptions: Record<string, string>;
    };
    rename: {
        notInMermaidBlock: string;
    };
};

const JA_MESSAGES: LocaleMessages = {
    quickFix: {
        reverseArrowOnly: '矢印の向きのみ反転（例：a --> b → a <-- b）',
        reverseDirectionOnly: '矢印の方向を反転（例：a --> b → b --> a）',
        reverseArrowAndDirection: '矢印の向きと方向を両方反転（例：a --> b → b <-- a）',
    },
    hover: {
        title: 'Mermaid 矢印',
        arrowDescriptions: {
            '..': '点線(クラス図)',
            '--': '実線(クラス図)',
            '..>': '依存(クラス図)',
            '<..': '依存(クラス図)',
            '-->': '関連(クラス図) / 遷移(状態遷移図)',
            '<--': '関連(クラス図) / 遷移(状態遷移図)',
            '--|>': '継承(クラス図)',
            '<|--': '継承(クラス図)',
            '..|>': '実現(クラス図)',
            '<|..': '実現(クラス図)',
            '--*': '合成(クラス図)',
            '*--': '合成(クラス図)',
            '--o': '集約(クラス図)',
            'o--': '集約(クラス図)',
            '->': '直線(シーケンス図)',
            '->>': '同期実線(シーケンス図)',
            '-->>': '同期点線(シーケンス図)',
            '-x': '終了実線(シーケンス図)',
            '--x': '終了点線(シーケンス図)',
            '-)': '非同期実線(シーケンス図)',
            '--)': '非同期点線(シーケンス図)',
        },
    },
    rename: {
        notInMermaidBlock: 'この位置ではリネームできません（mermaidコードブロック外）',
    },
};

const EN_MESSAGES: LocaleMessages = {
    quickFix: {
        reverseArrowOnly: 'Reverse arrow shape only (example: a --> b → a <-- b)',
        reverseDirectionOnly: 'Reverse relation direction (example: a --> b → b --> a)',
        reverseArrowAndDirection: 'Reverse both shape and direction (example: a --> b → b <-- a)',
    },
    hover: {
        title: 'Mermaid Arrow',
        arrowDescriptions: {
            '..': 'Dotted line (class diagram)',
            '--': 'Solid line (class diagram)',
            '..>': 'Dependency (class diagram)',
            '<..': 'Dependency (class diagram)',
            '-->': 'Association (class diagram) / Transition (state diagram)',
            '<--': 'Association (class diagram) / Transition (state diagram)',
            '--|>': 'Inheritance (class diagram)',
            '<|--': 'Inheritance (class diagram)',
            '..|>': 'Realization (class diagram)',
            '<|..': 'Realization (class diagram)',
            '--*': 'Composition (class diagram)',
            '*--': 'Composition (class diagram)',
            '--o': 'Aggregation (class diagram)',
            'o--': 'Aggregation (class diagram)',
            '->': 'Solid message (sequence diagram)',
            '->>': 'Synchronous solid message (sequence diagram)',
            '-->>': 'Synchronous dotted message (sequence diagram)',
            '-x': 'Termination solid message (sequence diagram)',
            '--x': 'Termination dotted message (sequence diagram)',
            '-)': 'Asynchronous solid message (sequence diagram)',
            '--)': 'Asynchronous dotted message (sequence diagram)',
        },
    },
    rename: {
        notInMermaidBlock: 'Rename is only available inside a mermaid code block.',
    },
};

const LOCALE_MAP: Record<Locale, LocaleMessages> = {
    ja: JA_MESSAGES,
    en: EN_MESSAGES,
};

export function getLocaleMessages(language: string): LocaleMessages {
    const locale = normalizeLocale(language);
    return LOCALE_MAP[locale];
}

function normalizeLocale(language: string): Locale {
    if (language.toLowerCase().startsWith('ja')) {
        return 'ja';
    }

    return 'en';
}