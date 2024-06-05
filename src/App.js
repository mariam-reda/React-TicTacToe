// App - React component
//JS file, uses JSX elements (<button>) = JS + HTML tags combo
//-components use prop className to style through CSS file

//import useState to allow for component state management ("remembering a square was clicked")
import { useState } from 'react';


//Square - component function; defined to return single board square button (reusable component - avoids duplicated code)
//-uses state variable to change value of square (button) on click
function Square() {
    //state variable and change-function returned from useState() call (our previous square value prop - initial value null)
    const [value, setValue] = useState(null);

    //handleClick() - function to handle click of Square instance through onClick props
    //-React re-renders Square when button is clicked, with new value 'X' displayed
    function handleClick() {
        setValue('X');
    }

    return (
        <button className="square" onClick={handleClick}> {value} </button>
    );
}


//Board - component function defined to build tictactoe board using Square components
//-returns single JSX element, wrapped using Fragment (<>...</>)
//main function of file (default) accessible outside file (exported)
export default function Board() {
    return (
    <>
        <div className="board-row">
            <Square />
            <Square />
            <Square />
        </div>
        <div className="board-row">
            <Square />
            <Square />
            <Square />
        </div>
        <div className="board-row">
            <Square />
            <Square />
            <Square />
        </div>
    </>
    );
}
  