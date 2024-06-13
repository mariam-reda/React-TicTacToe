// App - React component
//JS file, uses JSX elements (<button>) = JS + HTML tags combo
//-components use prop className to style through CSS file

//import useState to allow for component state management ("remembering a square was clicked")
import { useState } from 'react';


//Square - component function; defined to return single board square button (reusable component - avoids duplicated code)
//-uses props value passed from parent (Board) to determine state (empty/X/O)
//-uses function prop passed down from parent, called when square is clicked, to update parent on which square is clicked
//--=> child asks parent component to update state of board 
function Square({ value, onSquareClick }) {
    return (
        <button className="square" onClick={onSquareClick}> {value} </button>
    );
}
//----


//Board - component function defined to build TicTacToe board using Square components
//-parent component (Board) manages state of all Square components through passed props => lifted state from child to parent
//-Game component manages state of game (Board's parent) through passed props {xIsNext, squares, onPlay}
//-returns single JSX element, wrapped using Fragment (<>...</>)
function Board({ xIsNext, squares, onPlay }) {

    //---
    //handleClick() - function to handle click of Squares by updating squares array (state variable in Game) based on clicked square
    //-React re-renders Board when button is clicked, with new value 'X'/'O' displayed in clicked square
    function handleClick(i) {
        //check if square already has value (to avoid overwriting => return w/o update/changing turn) or if someone already won (game ended)
        if (squares[i] || calculateWinner(squares)) {
            return;
        }
        //otherwise, update empty square's value
        const nextSquares = squares.slice();        //creates copy of squares array (for immutable approach)
        //set value of square based on X/O turn
        if (xIsNext) {
            nextSquares[i] = "X";
        } else {
            nextSquares[i] = "O";
        }

        //call Game's onPlay function, passing it new updated squares array - Game component updates Board on user click + keeps history
        onPlay(nextSquares);            //React re-render board + update X/O turn (flip boolean)
    }
    //passed to child as new arrow function defined to call specific handleClick w/ param (to avoid immediate call => infinite render) 


    //---
    //determine winner of game + display whose turn it is/who won
    const winner = calculateWinner(squares);
    let status;
    if (winner) {
        status = "Winner: " + winner;
    } else {
        status = "Next player: " + (xIsNext ? "X" : "O");
    }

    
    //---
    //create Board layout using loops to make squares (instead of hardcoding)
    //-when created in loop, each item needs a key (=>sqVal calculation below)
    function buildBoard() {
        let tempBoard = [];
        //loop for each row in board
        for (let rowI = 0; rowI < 3; rowI++) {
            let tempBoardRow = [];
            //loop for each square in a row
            for (let colJ = 0; colJ < 3; colJ++) {
                let sqVal = (rowI * 3) + colJ;      //key, value, and onClick
                tempBoardRow.push( <Square key={sqVal} value={squares[sqVal]} onSquareClick={() => handleClick(sqVal)} /> );
            }
            tempBoard.push( <div key={rowI} className="board-row"> {tempBoardRow} </div> );
        }
        return tempBoard;
    }

    const boardSquaresLayout = buildBoard();

    //---
    //component return
    return (
    <>
        <div className="status"> {status} </div>
        { boardSquaresLayout }
    </>
    );
}
//----

//Game - top-level component to manage game (including history of moves)
//-controls Board (lifted-up state); updates squares + keeps history, and manages X/O turns 
//main function of file (default) accessible outside file (exported)
export default function Game() {
    
    //history - state variable array of game's past moves (array of arrays - each turn's squares array)
    const [history, setHistory] = useState( [Array(9).fill(null)] );
    //currentMove - state variable tracking which step (move) the user is currently viewing
    const [currentMove, setCurrentMove] = useState(0); 
    //---
    //xIsNext - boolean var to track X/O turn - first move is 'X' by default (move #0), so X turn on every even move - NOT state var (avoids redundant state)
    const xIsNext = (currentMove % 2 == 0);
    //currentSquares - array of squares displayed for the current move (based on *viewed* move, not nec. last squares array in history) - NOT state var
    const currentSquares = history[currentMove];


    //---
    //handlePlay() - function to update the game; updates squares array (like Board's old setSquares() - re-render) + flips X/O turn 
    //-passed down to Board component as props
    //-receives nextSquares (updated board array) from Board call
    function handlePlay(nextSquares) {
        //update history state variable w/ new squares array
        //only keep history up until currentMove's view (in case jumped back to previous move and changed play)
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];  //creates new array containing all items in history up to currentMove + appends nextSquares (spread syntax)
        setHistory(nextHistory);    
        //update currentMove state variable to next value from *new* history (in case jumped back and changed)
        setCurrentMove(nextHistory.length - 1);
        //above updates X/O-next-turn variable based on currentMove value
    }

    //---
    //jumpTo() - function to jump to (previous) moves in game history - done by updating currentMove state variable
    function jumpTo(nextMove) {
        //update currentMove state variable to update move currently viewed (re-render)
        setCurrentMove(nextMove);
        //X/O-turn updated based on currentMove value - since X always first ('next' on move 0), then X is next turn on every even currentMove
    }
    
    //---
    //moves - maps game moves (history) to list of buttons (per move), allowing to jump to past moves
    //--squares = mapped to an array element in history; move = mapped to array index in history
    const moves = history.map( (squares, move) => {
        //display description for button's move
        let description;
        if (move > 0) {
            description = "Go to move #" + move;
        } else {
            description = "Go to game start";
        }

        //for current move only, display "You are at move #.." instead of a button
        let listedMove;
        if (move == currentMove) {          //current move - return text, no button
            listedMove = <div> {"You are at move #" + move} </div>
        }
        else {                              //not current move - return button w/ onClick to jump to move
            listedMove = <button onClick={() => jumpTo(move)}> {description} </button>;
        }

        //return listed button element w/ jump onclick handler (w/ unique key property for each child in React list = move's unique sequence no.)
        //--moves will never be re-ordered, deleted, or inserted in middle => safe to use move index as key
        return (
            <li key={move}>
                {/* <button onClick={() => jumpTo(move)}> {description} </button> */}
                {listedMove}
            </li>
       );
    }
    );
    //onClick function passed as new arrow function defined to call specific jumpTo w/ param (to avoid immediate call => infinite render from state update)


    //---
    //component return - game board, and game info (history) = array list of React button elements (to jump to past moves)
    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            </div>
            <div className="game-info">
                <ol> {moves} </ol>
            </div>
        </div>
    );
} 


//----
//calculateWinner() - helper function to check for winner of TicTacToe
//-called by Board; passed current-viewed squares array
//-returns [X, O, or null]
function calculateWinner(squares) {
    //winning combos possible (horizontal, vertical, + diagonal)
    const winningLines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    //check if a winning combo line has been populated by a player (cell has value + cell's values all match)
    for (let i = 0; i < winningLines.length; i++) {
        const [a, b, c] = winningLines[i];     //copy indices in a winning combo
        if (squares[a] && squares[a] == squares[b] && squares[a] == squares[c]) {
            return squares[a];
        }
    }
    //otherwise, return null
    return null;
} 
