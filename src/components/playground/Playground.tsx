import React, {ChangeEvent} from 'react';
import {makeStyles, Theme} from '@material-ui/core/styles';
import TextField from "@material-ui/core/TextField";
import {Suggestion} from "../suggestion";
import {useSuggestion} from "../../core/hooks";
import {ExpansionPanel, FormGroup, Typography} from "@material-ui/core";
import {AlignmentMemory} from "./AlignmentMemory";
import Paper from '@material-ui/core/Paper';
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import {ExpandMore} from "@material-ui/icons";
import Switch from '@material-ui/core/Switch';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import {Corpus} from "./Corpus";

const useStyles = makeStyles((theme: Theme) => ({
    group: {
        margin: theme.spacing(1)
    },
    panel: {
        paddingLeft: 0,
        paddingRight: 0
    },
    settingsGroup: {
        padding: theme.spacing(1)
    }
}));

interface PlaygroundProps {
    /**
     * The initial source text.
     */
    sourceText: string;
    /**
     * The initial target text.
     */
    targetText: string;
    /**
     * The initial alignment memory to use.
     */
    memory: string[][];
    /**
     * The initial corpus to use.
     */
    corpus: string[];
}

export function Playground({sourceText, targetText, memory: initialMemory, corpus: initialCorpus}: PlaygroundProps) {
    const classes = useStyles();
    const [source, setSource] = React.useState(sourceText);
    const [target, setTarget] = React.useState(targetText);
    const [memory, setMemory] = React.useState(initialMemory as string[][]);
    const [corpus, setCorpus] = React.useState(initialCorpus as string[]);
    const suggestion = useSuggestion(source, target, memory, corpus);
    const [memoryExpanded, setMemoryExpanded] = React.useState(true);
    const [suggestionsExpanded, setSuggestionsExpanded] = React.useState(true);
    const [settings, setSettings] = React.useState({
        displayPopover: true,
        onlyShowMemory: false
    });

    function onChangeSource(e: ChangeEvent<HTMLInputElement>) {
        setSource(e.target.value);
    }

    function onChangeTarget(e: ChangeEvent<HTMLInputElement>) {
        setTarget(e.target.value);
    }

    function handleAddMemory(source: string, target: string) {
        setMemory([
            ...memory,
            [source, target]
        ]);
    }

    function handleDeleteMemory(index: number) {
        const newMemory = [...memory];
        newMemory.splice(index, 1);
        setMemory(newMemory);
    }

    function handleToggleMemory() {
        setMemoryExpanded(!memoryExpanded);
    }

    function handleToggleSuggestions() {
        setSuggestionsExpanded(!suggestionsExpanded);
    }

    function handleCorpusChange(newCorpus: string[]) {
        setCorpus(newCorpus);
    }

    const handleSettingChange = (name: string) => (event: ChangeEvent<HTMLInputElement>) => {
        setSettings({...settings, [name]: event.target.checked});
    };

    return (
        <div>
            <Typography variant="h6">Sentences</Typography>
            <Paper>
                <FormGroup className={classes.group}>
                    <TextField
                        label="Source text"
                        margin="normal"
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={onChangeSource}
                        value={source}
                        variant="outlined"
                    />
                    <TextField
                        label="Target text"
                        margin="normal"
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={onChangeTarget}
                        value={target}
                        variant="outlined"
                    />
                </FormGroup>
            </Paper>
            <ExpansionPanel
                expanded={memoryExpanded}
                onChange={handleToggleMemory}>
                <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
                    <Typography variant="h6">Alignment Memory</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <AlignmentMemory
                        memory={memory}
                        onAdd={handleAddMemory}
                        onDelete={handleDeleteMemory}/>
                </ExpansionPanelDetails>
            </ExpansionPanel>

            <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
                    <Typography variant="h6">Corpus</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Grid container direction="column" alignItems="stretch">
                        <Grid item>
                            <Typography variant="caption">Enter matching lines of text below. The source and target fields must contain the same number of lines.</Typography>
                        </Grid>
                        <Grid item>
                            <Corpus corpus={corpus} onChange={handleCorpusChange} />
                        </Grid>
                    </Grid>
                </ExpansionPanelDetails>
            </ExpansionPanel>

            <ExpansionPanel
                expanded={suggestionsExpanded}
                onChange={handleToggleSuggestions}>
                <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
                    <Typography variant="h6">Predictions</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.panel}>
                    <Grid container spacing={1} direction="column" alignItems="stretch">
                        <Grid item>
                            <FormGroup row className={classes.settingsGroup}>
                                <FormControlLabel
                                    control={
                                        <Switch checked={settings.displayPopover}
                                                onChange={handleSettingChange('displayPopover')}
                                                value="displayPopover"
                                        />
                                    }
                                    label="Enable popover"
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={settings.onlyShowMemory}
                                            onChange={handleSettingChange('onlyShowMemory')}
                                            value="onlyShowMemory"
                                        />
                                    }
                                    label="Show only alignment memory"
                                />
                            </FormGroup>
                        </Grid>
                        <Grid item>
                            {
                                suggestion ? (
                                    <Suggestion
                                        suggestion={suggestion}
                                        withPopover={settings.displayPopover}
                                        minConfidence={settings.onlyShowMemory ? 1 : 0}
                                    />
                                ) : (
                                    <Typography
                                        variant="h6"
                                        display="block"
                                        color="textSecondary"
                                        align="center">Start typing to see suggestions...</Typography>
                                )
                            }
                        </Grid>
                    </Grid>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </div>
    );
}

Playground.defaultProps = {
    sourceText: "",
    targetText: "",
    memory: [],
    corpus: []
} as Partial<PlaygroundProps>;