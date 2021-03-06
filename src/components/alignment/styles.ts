import {makeStyles} from "@material-ui/styles";
import memoizeOne from "memoize-one";
import {AlignmentProps} from "./Alignment";

const emptyTop = memoizeOne((props) => {
    return !props.sourceWords || props.sourceWords.length === 0;
});

const emptyBottom = memoizeOne((props) => {
    return !props.targetWords || props.targetWords.length === 0;
});

const emptyAlignment = memoizeOne((props) => {
    return emptyTop(props) && emptyBottom(props);
});

const largeAlignment = memoizeOne((props) => {
    return (!emptyTop(props) && props.sourceWords.length > 1) || (!emptyBottom(props) && props.targetWords.length > 1);
});

const defaultAlignmentWidth = '115px';
const blueBorder = '3px dashed #44C6FF';
const clearBorder = '3px dashed transparent';
const whiteBorder = '3px dashed #ffffff';
const transitionSpeed = '0.1s';

const rowStyle = {
    display: 'flex',
    transition: transitionSpeed,
    position: 'relative'
};

function makeDropTopStyles({hoverTop, dropTop}: Partial<AlignmentProps>) {
    if (hoverTop && dropTop) {
        return {
            border: blueBorder
        };
    }
    return {};
}

function makeDropBottomStyles({hoverBottom, dropBottom}: Partial<AlignmentProps>) {
    if (hoverBottom && dropBottom) {
        return {
            border: blueBorder
        };
    }
    return {};
}

export const useStyles = makeStyles({
    root: (props: AlignmentProps) => ({
        padding: '7px',
        backgroundColor: props.suggested ? '#bedac2' : '#DCDCDC',
        margin: '0px 10px 10px 0px',
        minWidth: emptyAlignment(props) ? `calc(${defaultAlignmentWidth}/2)` : defaultAlignmentWidth,
        flexGrow: largeAlignment(props) ? 1 : 0,
        ...props.style,
        ...(props.styles ? props.styles.root : {})
    }),
    content: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
    },
    top: (props: AlignmentProps) => ({
        transition: transitionSpeed,
        flexGrow: 1,
        width: '100%',
        minHeight: '45px',
        border: emptyTop(props) || props.dropTop ? whiteBorder : clearBorder,
        boxSizing: 'border-box',
        marginBottom: '7px',
        ...makeDropTopStyles(props),
        ...(props.styles ? props.styles.top : {})
    }),
    bottom: (props: AlignmentProps) => ({
        transition: transitionSpeed,
        flexGrow: 1,
        width: '100%',
        direction: props.targetDirection,
        minHeight: '45px',
        border: emptyBottom(props) || props.dropBottom ? whiteBorder : clearBorder,
        boxSizing: 'border-box',
        ...makeDropBottomStyles(props),
        ...(props.styles ? props.styles.bottom : {})
    }),
    topRow: (props: AlignmentProps) => ({
        display: 'flex',
        transition: transitionSpeed,
        position: 'relative',
        top: props.dropTop ? '7px' : 0,
        left: props.dropTop ? '7px' : 0,
        opacity: props.hoverTop && props.dropTop ? '0.8' : 1,
        ...(props.styles ? props.styles.topRow : {})
    }),
    bottomRow: (props: AlignmentProps) => ({
        display: 'flex',
        transition: transitionSpeed,
        position: 'relative',
        top: props.dropBottom ? '7px' : 0,
        left: props.dropBottom ? '7px' : 0,
        opacity: props.hoverBottom && props.dropBottom ? '0.8' : 1,
        ...(props.styles ? props.styles.bottomRow : {})
    })
});