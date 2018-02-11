import React from 'react';
import ReactDOM from 'react-dom';

export default function run_index(root) {
    ReactDOM.render(<Index/> , root);
}

class Index extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-sm-4">
                        <input type="text" className="form-control"
                            id="game-name" placeholder="Name of Game"></input>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <Submit/>
                </div>
            </div>
        )
    }
}

function Submit() {
    return(
        <button type="button" className="btn btn-primary"
                onClick={
                    () => {
                        let name = $("#game-name").val();
                        if (name != "") {
                            window.location = "/game/"+name;
                        }
                    }
                }>Join Game</button>
    );
}
