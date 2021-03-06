import React, {useState} from 'react';
import {Alignment} from '../alignment';
import {Word} from "../word";
import Popover from '@material-ui/core/Popover';
import {PredictionInfo} from "./PredictionInfo";
import {Suggestion as WordMapSuggestion} from "wordmap/core";
import {useStyles} from "./styles";

export interface SuggestionProps {
    /**
     * A suggestion produced by wordMAP.
     */
    suggestion: WordMapSuggestion;
    /**
     * The language direction of the source text. This gets passed down to the {@link Alignment}.
     */
    sourceDirection?: 'rtl' | 'ltr';
    /**
     * The language direction of the target text.
     */
    targetDirection?: 'rtl' | 'ltr';
    /**
     * Enables displaying the prediction info popover.
     * @deprecated: use `AlignmentProps#RootProps` to manually add `onMouseEnter` and `onMouseLeave` handlers.
     */
    withPopover: boolean;
    /**
     * The minimum confidence required for a prediction to be displayed.
     */
    minConfidence: number;
    /**
     * Allows overriding the root styles
     */
    styles?: object;
    /**
     * Overrides the {@link Word} props
     */
    WordProps?: object;
    /**
     * Overrides the {@link Alignment} props
     */
    AlignmentProps?: object;
}

/**
 * Renders a grid of word/phrase alignments
 */
export function Suggestion({suggestion, withPopover, minConfidence, styles, WordProps, AlignmentProps, sourceDirection, targetDirection}: SuggestionProps) {
    const classes = useStyles({sourceDirection, styles} as SuggestionProps);
    const [anchorEl, setAnchorEl] = useState(null as any);
    const [hoverIndex, setHoverIndex] = useState(-1);

    const handlePopoverOpen = (predictionKey: number) => (event: Event) => {
        if (suggestion.getPredictions()[predictionKey].confidence >= minConfidence) {
            setHoverIndex(predictionKey);
            setAnchorEl(event.currentTarget);
        }
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
        setHoverIndex(-1);
    };

    if (suggestion) {
        const predictionDetails = hoverIndex >= 0 ? suggestion.getPredictions()[hoverIndex] : null;
        const open: boolean = Boolean(anchorEl) && withPopover;
        return (
            <div className={classes.root}>
                {
                    suggestion.getPredictions().map((p, key) => {
                        const alignment = p.alignment;
                        const source: JSX.Element[] = alignment.source.getTokens().map((t, i) => {
                            return (
                                <Word key={i}
                                      occurrence={t.occurrence}
                                      occurrences={t.occurrences}
                                      {...WordProps}
                                >{t.toString()}</Word>
                            );
                        });
                        let target: JSX.Element[] = [];
                        if (p.confidence >= minConfidence) {
                            target = alignment.target.getTokens().map((t, i) => {
                                return (
                                    <Word key={i}
                                          suggested
                                          occurrence={t.occurrence}
                                          occurrences={t.occurrences}
                                          {...WordProps}
                                    >{t.toString()}</Word>
                                );
                            });
                        }

                        return (
                            <Alignment
                                key={key}
                                rootProps={{
                                    onMouseEnter: handlePopoverOpen(key),
                                    onMouseLeave: handlePopoverClose
                                }}
                                style={hoverIndex === key && withPopover ? {
                                    backgroundColor: '#fff',
                                    border: 'solid 1px rgb(220, 220, 220)'
                                } : {
                                    border: 'solid 1px transparent'
                                }}
                                targetWords={target}
                                sourceWords={source}
                                targetDirection={targetDirection}
                                {...AlignmentProps}
                            />
                        );
                    })
                }
                <Popover
                    className={classes.popover}
                    classes={{paper: classes.paper}}
                    open={open}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center'
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    onClose={handlePopoverClose}
                    disableRestoreFocus
                    disableScrollLock
                >
                    {
                        predictionDetails ? (
                            <PredictionInfo prediction={predictionDetails}/>
                        ) : null
                    }
                </Popover>
            </div>
        );
    }
    return null;
}

Suggestion.defaultProps = {
    sourceDirection: 'ltr',
    targetDirection: 'ltr',
    withPopover: false,
    minConfidence: 0,
    styles: {},
    WordProps: {},
    AlignmentProps: {}
} as Partial<SuggestionProps>;