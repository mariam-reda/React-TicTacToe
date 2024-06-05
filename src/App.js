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


//Board - component function defined to build tictactoe board using Square components
//-parent component manages state of all square components through passed props => lifted state from child to parent
//-returns single JSX element, wrapped using Fragment (<>...</>)
//main function of file (default) accessible outside file (exported)
export default function Board() {
    //state variable + change-function to manage squares' values (X/O) in board - initial default = array of nulls (corresponding to squares)
    const [squares, setSquares] = useState(Array(9).fill(null));

    //handleClick() - function to handle click of Squares by updating squares array (state variable) based on clicked square
    //-React re-renders Board when button is clicked, with new value 'X' displayed in clicked square
    function handleClick(i) {
        const nextSquares = squares.slice();    //creates copy of squares array
        nextSquares[i] = "X";
        setSquares(nextSquares);                //React updates state of Board component => re-render it + its child components
    }
    //passed to child as new arrow function defined to call specific handleClick w/ param (to avoid immediate call => infinite render) 

    return (
    <>
        <div className="board-row">
            <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
            <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
            <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
        </div>
        <div className="board-row">
            <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
            <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
            <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
        </div>
        <div className="board-row">
            <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
            <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
            <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
        </div>
    </>
    );
}
  