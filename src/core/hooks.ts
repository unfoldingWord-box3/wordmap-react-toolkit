import {useEffect, useState} from "react";
import Lexer from "wordmap-lexer";
import WordMap from "wordmap";
import {Suggestion} from "wordmap/core";
import Token from "wordmap-lexer/dist/Token";
import {WordMapProps} from "wordmap/core/WordMap";

/**
 * Returns tokenized version of the text
 * @param text
 * @returns {Array}
 */
export function useTokens(text: string): Token[] {
    const [tokens, setTokens] = useState([] as Token[]);
    useEffect(() => {
        setTokens(Lexer.tokenize(text));
    }, [text]);
    return tokens;
}

/**
 * Returns a wordMAP instance
 * @param memory - alignment memory to use
 * @param corpus - corpus to use
 * @param config - configuration to be passed to the wordMAP.
 * @returns {{}}
 */
export function useWordMAP(memory: string[][] = [], corpus: string[] = [], config: WordMapProps = {}): WordMap | null {
    const [map, setMap] = useState(null as unknown);

    // create wordMAP
    useEffect(() => {
        setMap(new WordMap(config));
    }, []);

    // rebuild engine with corpus
    useEffect(() => {
        if (corpus.length === 2) {
            const newMap = new WordMap(config);
            newMap.appendCorpusString(corpus[0], corpus[1]);
            setMap(newMap);
        }
    }, [corpus]);

    // update memory
    useEffect(() => {
        if (map !== null) {
            (map as WordMap).clearAlignmentMemory();
            memory.map(alignment => (map as WordMap).appendAlignmentMemoryString(alignment[0], alignment[1]));
        }
    }, [map, memory]);

    return map as WordMap | null;
}

/**
 * @deprecated use {@link useSuggestions} instead
 * Returns a suggested alignment between two sentences.
 * @param source
 * @param target
 * @param memory
 * @param corpus
 * @returns {{}}
 */
export function useSuggestion(source: string, target: string, memory: string[][] = [], corpus: string[] = []): Suggestion | null {
    const map = useWordMAP(memory, corpus);
    const [suggestion, setSuggestion] = useState(null as Suggestion | null);

    // predict
    useEffect(() => {
        if (map !== null) {
            const suggestions = map.predict(source, target, 1);
            setSuggestion(suggestions[0]);
        }
    }, [map, memory, source, target]);

    return suggestion as Suggestion | null;
}

/**
 * Returns a suggested alignment between two sentences.
 * @param source the source sentence
 * @param target the target sentence to align with the source.
 * @param memory alignment memory
 * @param corpus
 * @param maxSuggestions the maximum number of suggestions to generate.
 * @param excludeCorpus excludes everything except for the alignment memory in suggestion output.
 * @param config configuration to pass to wordMAP
 * @returns {{}}
 */
export function useSuggestions(source: string, target: string, memory: string[][] = [], corpus: string[] = [], maxSuggestions = 1, excludeCorpus: boolean = false, config: WordMapProps): Suggestion[] {
    const map = useWordMAP(memory, corpus, config);
    const [suggestions, setSuggestions] = useState([] as Suggestion[]);

    // predict
    useEffect(() => {
        if (map !== null) {
            const suggestions = map.predict(source, target, maxSuggestions, excludeCorpus);
            setSuggestions(suggestions);
        }
    }, [map, memory, source, target, excludeCorpus]);

    return suggestions;
}