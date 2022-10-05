type ReplaceOptions = {
	all?: boolean;
};

export type Replace<
	Input extends string,
	Search extends string,
	Replacement extends string,
	Options extends ReplaceOptions = {},
> = Input extends `${infer Head}${Search}${infer Tail}`
	? Options['all'] extends true
		? `${Head}${Replacement}${Replace<Tail, Search, Replacement, Options>}`
		: `${Head}${Replacement}${Tail}`
	: Input;

export type DecorateAsObject<
	Input extends string,
	Search extends string,
	Replacement extends string,
> = Input extends `${infer Head}${Search}${infer Tail}`
	? `${Head}${Replace<Tail, Search, Replacement>}`
	: Input;

export type Split<
	S extends string,
	Delimiter extends string,
> = S extends `${infer Head}${Delimiter}${infer Tail}`
	? [Head, ...Split<Tail, Delimiter>]
	: S extends Delimiter
	? []
	: [S];

export type ObjectFromList<L extends ReadonlyArray<string>, S = string> = {
        [K in (L extends ReadonlyArray<infer U> ? U : never)]: S
};

export type KeysAsList<K extends string> = K extends `${infer Head}-${infer Tail}` ? [ Head, Tail ] : K extends `${infer Head}.${infer Tail}` ? [ Head, Tail ] : [K]
