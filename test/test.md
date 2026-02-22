# Mermaid Class Tools Test

このファイルは拡張機能の動作確認用です。

## 1) classDiagram（正常）

```mermaid
classDiagram
    class User
    class Order
    User --> Order
```

```mermaid
classDiagram
    class User
    User --->
```

```mermaid
classDiagram
    namespace MyNamespace {
        class User
        class Order
    }
    User --> Order
    MyNamespace --> User
```

## 2) sequenceDiagram

```mermaid
sequenceDiagram
    Alice->>Bob: Hello Bob
    Bob-->>Alice: Hi Alice
```

```mermaid
sequenceDiagram
    Alice->>
```

```mermaid
sequenceDiagram
    Alice--oBob: Hello Bob
```

## 3) flowchart

```mermaid
flowchart TD
    A --> B
    B --> C
```

```mermaid
flowchart TD
    A -->
```

## 4) erDiagram

```mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE_ITEM : contains
```

```mermaid
erDiagram
    CUSTOMER ||--o{ : places
```

## 5) stateDiagram

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Running
    Running --> [*]
```

```mermaid
stateDiagram-v2
    [*] -->
```

