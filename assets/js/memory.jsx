import React from 'react';
import ReactDOM from 'react-dom';
import {Button} from 'reactstrap';

export default function run_memory(root, channel) {
    ReactDOM.render(<Memory channel={channel}/> , root);
}

class Memory extends React.Component {
    constructor(props) {
        super(props);

        this.channel = props.channel;
        this.channel.join()
            .receive("ok", this.gotView.bind(this))
            .receive("error", resp => {console.log("Unable to join", resp)});

        let tempDisplay = [];
        for (let i = 0; i < 16; i++) {
            tempDisplay.push("");
        }
        let tempList = [];
        for (let i = 0; i < 16; i++) {
            tempList.push(0)
        }
        this.state = {
            displayLetter: tempDisplay,
            disabled: tempList,
            clicks: 0,
            allow: 1,
            check: 0,
        };
        this.click = "";
        this.tiles = [];
        this.one = -1;
    }

    gotView(view) {
        console.log("New View", view);
        this.setState(view.game);
    }

    hideView(view) {
        console.log("hide view", view);
        this.setState(view.hide);
    }

    tileClick(number) {
        if (!$("#b"+number).prop("disabled") && ($("#"+number).text() == "")
        && (!$("#b"+number).hasClass("notallow"))) {
            if (this.one == -1) {
                console.log("-1");
                this.one = number;
                this.channel.push("click", {displayLetter: this.state.displayLetter, clicks: this.state.clicks, tile: number, comp: 0})
                    .receive("ok", this.gotView.bind(this));
            } else {
                console.log("else")
                this.channel.push("click", {displayLetter: this.state.displayLetter, clicks: this.state.clicks, comp: 1, one: this.one, two: number})
                       .receive("ok", (resp) => {
                           this.gotView(resp);
                           let newDisabled = this.state.disabled.slice();
                           console.log(this.one);
                           newDisabled[this.one] = 1;
                           newDisabled[number] = 1;
                           this.setState({disabled: newDisabled, check: 1});
                           this.one = -1;
                       })
                       .receive("notok", (resp) => {
                           this.setState({allow: 0});
                           this.gotView(resp);
                           this.setState({check: -1})
                           setTimeout(() => {
                               this.hideView(resp)
                               this.setState({allow: 1 })
                           }, 1000);
                           this.one = -1;
                       });

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
                    <Reset channel={this.channel} gotview={this.gotView.bind(this)}/>
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

function Reset(props){
    let channel = props.channel;
    return (
        <div className="col-auto col-reset">
            <Button type="button" className="btn btn-danger reset-button"
                    onClick={() => {
                            channel.push("reset", {})
                                   .receive("ok", props.gotview.bind(this));
                    }}>
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
