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
        this.state = {
            letterBase: base,
            letterPair: pair,
        };
    }


    render() {
        console.log(this.state.letterPair);
        return (
            <div className="container">
                <ReturnSingleRow letter={this.state.letterPair[0]} />
                <ReturnSingleRow />
                <ReturnSingleRow />
                <ReturnSingleRow />
                <Reset />
            </div>
        );
    }
}

function RenderHelper(props) {
    let letter = props.letter;
    let result = 0;
    /* for (let i = 0; i < 4; i++) {
     *     
     * }*/
}

function ReturnSingleRow(props){
    let letter = props.letter;
    function Tile() {
        return (
            <div className="letterBox">
                <h1 className="gameLetter">{letter}</h1>
            </div>
        );
    }
    return (
        <div className="row align-items-center justify-content-center">
            <div className="col">
                <Tile />
            </div>
            <div className="col">
                2
            </div>
            <div className="col">
                3
            </div>
            <div className="col">
                4
            </div>
        </div>
    );

}

function Reset(){
    return (
        <div className="row align-items-end justify-content-end">
            <Button type="button" className="btn btn-danger">Reset Game</Button>
        </div>
    );
}
