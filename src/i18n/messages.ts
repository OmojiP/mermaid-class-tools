export type Locale = 'ja' | 'en';
export type MermaidDiagramType = 'classDiagram' | 'sequenceDiagram' | 'stateDiagram' | 'erDiagram';

export type LocaleMessages = {
    quickFix: {
        keepPositionsReverseRelation: string;
        swapPositionsReverseRelation: string;
        swapPositionsKeepRelation: string;
    };
    hover: {
        title: string;
        arrowDescriptionsByDiagram: Record<MermaidDiagramType, Record<string, string>>;
    };
    rename: {
        notInMermaidBlock: string;
    };
};

const JA_MESSAGES: LocaleMessages = {
    quickFix: {
        keepPositionsReverseRelation: '位置関係を保存, 関係方向を逆転（例：a --> b → a <-- b）',
        swapPositionsReverseRelation: '位置関係を逆転, 関係方向を逆転（例：a --> b → b --> a）',
        swapPositionsKeepRelation: '位置関係を逆転, 関係方向を保存（例：a --> b → b <-- a）',
    },
    hover: {
        title: 'Mermaid 矢印',
        arrowDescriptionsByDiagram: {
            classDiagram: {
                '..': '点線（補助的な関係）',
                '--': '実線（方向なしの関連）',
                '..>': '依存（一時的な利用側からの矢印）',
                '<..': '依存（一時的な利用側からの矢印）',
                '-->': '関連（参照を保持する利用者からの矢印）',
                '<--': '関連（参照を保持する利用者からの矢印）',
                '--|>': '継承（派生から基底への矢印）',
                '<|--': '継承（派生から基底への矢印）',
                '..|>': '実現（実装からインターフェースへの矢印）',
                '<|..': '実現（実装からインターフェースへの矢印）',
                '--*': '合成（ライフサイクルを共有する強い所有）',
                '*--': '合成（ライフサイクルを共有する強い所有）',
                '--o': '集約（ライフサイクルを独立させた弱い所有）',
                'o--': '集約（ライフサイクルを独立させた弱い所有）',
            },
            sequenceDiagram: {
                '->': '実線（方向なしの送信）',
                '-->': '点線（方向なしの応答）',
                '->>': '同期実線（同期的に送信）',
                '-->>': '同期点線（同期的に応答）',
                '-x': '終了実線（送信後に相手を終了）',
                '--x': '終了点線（応答後に相手を終了）',
                '-)': '非同期実線（非同期に送信）',
                '--)': '非同期点線（非同期に応答）',
            },
            stateDiagram: {
                '-->': '遷移',
            },
            erDiagram: {
                '|o..o|': '0..1 対 0..1（外部キー）',
                '|o--o|': '0..1 対 0..1（識別関係）',
                '|o..o{': '0..1 対 0以上（外部キー）',
                '|o--o{': '0..1 対 0以上（識別関係）',
                '|o..||': '0..1 対 1（外部キー）',
                '|o--||': '0..1 対 1（識別関係）',
                '|o..|{': '0..1 対 1以上（外部キー）',
                '|o--|{': '0..1 対 1以上（識別関係）',
                '}o..o|': '0以上 対 0..1（外部キー）',
                '}o--o|': '0以上 対 0..1（識別関係）',
                '}o..o{': '0以上 対 0以上（外部キー）',
                '}o--o{': '0以上 対 0以上（識別関係）',
                '}o..||': '0以上 対 1（外部キー）',
                '}o--||': '0以上 対 1（識別関係）',
                '}o..|{': '0以上 対 1以上（外部キー）',
                '}o--|{': '0以上 対 1以上（識別関係）',
                '||..o|': '1 対 0..1（外部キー）',
                '||--o|': '1 対 0..1（識別関係）',
                '||..o{': '1 対 0以上（外部キー）',
                '||--o{': '1 対 0以上（識別関係）',
                '||..||': '1 対 1（外部キー）',
                '||--||': '1 対 1（識別関係）',
                '||..|{': '1 対 1以上（外部キー）',
                '||--|{': '1 対 1以上（識別関係）',
                '}|..o|': '1以上 対 0..1（外部キー）',
                '}|--o|': '1以上 対 0..1（識別関係）',
                '}|..o{': '1以上 対 0以上（外部キー）',
                '}|--o{': '1以上 対 0以上（識別関係）',
                '}|..||': '1以上対1（外部キー）',
                '}|--||': '1以上対1（識別関係）',
                '}|..|{': '1以上 対 1以上（外部キー）',
                '}|--|{': '1以上 対 1以上（識別関係）',
            },
        },
    },
    rename: {
        notInMermaidBlock: 'この位置ではリネームできません（mermaidコードブロック外）',
    },
};

const EN_MESSAGES: LocaleMessages = {
    quickFix: {
        keepPositionsReverseRelation: 'Keep node positions, reverse relation direction (example: a --> b → a <-- b)',
        swapPositionsReverseRelation: 'Swap node positions, reverse relation direction (example: a --> b → b --> a)',
        swapPositionsKeepRelation: 'Swap node positions, keep relation direction (example: a --> b → b <-- a)',
    },
    hover: {
        title: 'Mermaid Arrow',
        arrowDescriptionsByDiagram: {
            classDiagram: {
                '..': 'Dotted line (auxiliary relationship)',
                '--': 'Solid line (non-directional association)',
                '..>': 'Dependency (temporary usage from client side)',
                '<..': 'Dependency (temporary usage from client side)',
                '-->': 'Association (arrow from referencing side)',
                '<--': 'Association (arrow from referencing side)',
                '--|>': 'Inheritance (arrow from derived to base)',
                '<|--': 'Inheritance (arrow from derived to base)',
                '..|>': 'Realization (arrow from implementation to interface)',
                '<|..': 'Realization (arrow from implementation to interface)',
                '--*': 'Composition (strong ownership with shared lifecycle)',
                '*--': 'Composition (strong ownership with shared lifecycle)',
                '--o': 'Aggregation (weak ownership with independent lifecycle)',
                'o--': 'Aggregation (weak ownership with independent lifecycle)',
            },
            sequenceDiagram: {
                '->': 'Solid line (non-directional send)',
                '-->': 'Dotted line (non-directional response)',
                '->>': 'Synchronous solid message',
                '-->>': 'Synchronous dotted message',
                '-x': 'Termination solid message',
                '--x': 'Termination dotted message',
                '-)': 'Asynchronous solid message',
                '--)': 'Asynchronous dotted message',
            },
            stateDiagram: {
                '-->': 'Transition',
            },
            erDiagram: {
                '|o..o|': '0..1 to 0..1 (FK)',
                '|o--o|': '0..1 to 0..1 (Identifying)',
                '|o..o{': '0..1 to 0+ (FK)',
                '|o--o{': '0..1 to 0+ (Identifying)',
                '|o..||': '0..1 to 1 (FK)',
                '|o--||': '0..1 to 1 (Identifying)',
                '|o..|{': '0..1 to 1+ (FK)',
                '|o--|{': '0..1 to 1+ (Identifying)',
                '}o..o|': '0+ to 0..1 (FK)',
                '}o--o|': '0+ to 0..1 (Identifying)',
                '}o..o{': '0+ to 0+ (FK)',
                '}o--o{': '0+ to 0+ (Identifying)',
                '}o..||': '0+ to 1 (FK)',
                '}o--||': '0+ to 1 (Identifying)',
                '}o..|{': '0+ to 1+ (FK)',
                '}o--|{': '0+ to 1+ (Identifying)',
                '||..o|': '1 to 0..1 (FK)',
                '||--o|': '1 to 0..1 (Identifying)',
                '||..o{': '1 to 0+ (FK)',
                '||--o{': '1 to 0+ (Identifying)',
                '||..||': '1 to 1 (FK)',
                '||--||': '1 to 1 (Identifying)',
                '||..|{': '1 to 1+ (FK)',
                '||--|{': '1 to 1+ (Identifying)',
                '}|..o|': '1+ to 0..1 (FK)',
                '}|--o|': '1+ to 0..1 (Identifying)',
                '}|..o{': '1+ to 0+ (FK)',
                '}|--o{': '1+ to 0+ (Identifying)',
                '}|..||': '1+ to 1 (FK)',
                '}|--||': '1+ to 1 (Identifying)',
                '}|..|{': '1+ to 1+ (FK)',
                '}|--|{': '1+ to 1+ (Identifying)',
            },
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