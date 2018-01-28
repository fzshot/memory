import React from 'react';
import ReactDOM from 'react-dom';
import {Button} from 'reactstrap';

export default function run_memory(root) {
    ReactDOM.render(<Memory/>, root);
}

class Memory extends React.Component {
    constructor(props) {
        super(props);
        let base = ["A", "B", "C", "D", "E", "F", "G", "H"];
        let randomLetter_1 = _.shuffle(base);
        let randomLetter_2 = _.shuffle(base);
        let pair = [];
        pair.push(randomLetter_1, randomLetter_2);
        pair = _.flatten(pair);
        let tempDisplay = [];
        for (let i = 0; i < 16; i++) {
            tempDisplay.push("");
        }
        let tempList = [];
        for (let i = 0; i < 16; i++) {
            tempList.push(0)
        }
        this.state = {
            letterBase: base,
            letterPair: pair,
            displayLetter: tempDisplay,
            disabled: tempList,
            clicks: 0,
            allow: 1,
            check: 0,
        };
        this.click = "";
        this.tiles = [];
    }

    tileClick(number) {
        if (!$("#b"+number).prop("disabled") && ($.inArray(number, this.tiles) == -1)
        && (!$("#b"+number).hasClass("notallow"))) {
            let newDisplayLetter = this.state.displayLetter.slice();
            this.tiles.push(number);
            newDisplayLetter[number] = this.state.letterPair[number];
            let newClicks = this.state.clicks + 1;
            this.setState({displayLetter: newDisplayLetter, clicks: newClicks});
            this.clickHelper(this.state.letterPair[number]);
        }
    }

    clickHelper(letter) {
        if (this.click == "") {
            this.click = letter;
        }
        else {
            let newDisplayLetter = this.state.displayLetter.slice();
            if (letter == this.click) {
                let tiledisable = this.state.disabled.slice();
                newDisplayLetter[this.tiles[0]] = this.state.letterPair[this.tiles[0]];
                newDisplayLetter[this.tiles[1]] = this.state.letterPair[this.tiles[1]];
                tiledisable[this.tiles[0]] = 1;
                tiledisable[this.tiles[1]] = 1;
                this.click = "";
                this.tiles = [];
                this.setState({displayLetter: newDisplayLetter, check: 1, disabled: tiledisable});
            }
            else {
                newDisplayLetter[this.tiles[0]] = this.state.letterPair[this.tiles[0]];
                newDisplayLetter[this.tiles[1]] = this.state.letterPair[this.tiles[1]];
                this.setState({check: -1, displayLetter: newDisplayLetter, allow: 0});
                this.click = "";
                setTimeout(() => {
                    newDisplayLetter[this.tiles[0]] = "";
                    newDisplayLetter[this.tiles[1]] = "";
                    this.setState({displayLetter: newDisplayLetter, allow: 1});
                    this.tiles = [];
                }, 1000);
            }
        }
    }


    render() {
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col">
                        <ResultHelper result={this.state.check} />
                    </div>
                </div>
                <ReturnSingleRow letter={this.state.displayLetter} currentLetter={0}
                click={this.tileClick.bind(this)}
                disable={this.state.disabled} allow={this.state.allow} />
                <ReturnSingleRow letter={this.state.displayLetter} currentLetter={4}
                click={this.tileClick.bind(this)}
                disable={this.state.disabled} allow={this.state.allow} />
                <ReturnSingleRow letter={this.state.displayLetter} currentLetter={8}
                click={this.tileClick.bind(this)}
                disable={this.state.disabled} allow={this.state.allow} />
                <ReturnSingleRow letter={this.state.displayLetter} currentLetter={12}
                click={this.tileClick.bind(this)}
                disable={this.state.disabled} allow={this.state.allow} />
                <div className="row justify-content-center last-row">
                    <Clicks clicks={this.state.clicks} />
                    <Reset />
                </div>
            </div>
        );
    }
}

function ResultHelper(props) {
    let result = props.result;
    if (result == -1) {
        return (
            <div className="alert alert-danger" role="alert">
                <span className="guess">Wrong!</span>
            </div>
        );
    }
    else if (result == 1){
        return (
            <div className="alert alert-success" role="alert">
                <span className="guess">Correct!</span>
            </div>
        );
    }
    else {
        return (
            <div className="alert alert-primary" role="alert">
                <span className="guess">Game Started!</span>
            </div>
        );
    }
}

function RenderHelper(props) {
    function Tile(props) {
        let letter = props.letter;
        let number = props.number;
        let buttonid = "b"+number;
        let disable = false;
        let clickallow = props.allow;
        if (props.disable[number] == 1) {
            disable = true;
        }
        return (
            <Button disabled={disable} type="button" id={buttonid}
                    className={clickallow ? "btn btn-dark" : "btn btn-dark notallow"} onClick={() =>
                        props.click(number) }>
                <span className="tile" id={number}>{letter}</span>
            </Button>
        );
    }
    let letter = props.letter;
    let currentLetter = props.currentLetter;
    let tilesArray = []
    for (let j = 0; j < 4; j++, currentLetter++) {
        tilesArray.push(<Tile letter={letter[currentLetter]} click={props.click} number={currentLetter} disable={props.disable} allow={props.allow} />);
    }
    return tilesArray;

}

function ReturnSingleRow(props){
    let letter = props.letter;
    let tilesArray = RenderHelper(props);
    return (
        <div className="row align-items-center justify-content-center">
            <div className="col-auto">
                {tilesArray[0]}
            </div>
            <div className="col-auto">
                {tilesArray[1]}
            </div>
            <div className="col-auto">
                {tilesArray[2]}
            </div>
            <div className="col-auto">
                {tilesArray[3]}
            </div>
        </div>
    );

}

function Reset(){
    return (
        <div className="col-auto col-reset">
            <Button type="button" className="btn btn-danger reset-button"
            onClick={() => location.reload() }>
                Reset Game
            </Button>
        </div>
    );
}

function Clicks(props) {
    return (
        <div className="col-auto col-clicks">
            <div className="alert alert-primary clicks" role="alert">
                Clicks: {props.clicks}
            </div>
        </div>
    );
}
