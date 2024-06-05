// App - React component
//JS file, uses JSX elements (<button>) = JS + HTML tags combo
//-components use prop className to style through CSS file


//Square - component function; defined to return single board square button (reusable component - avoids duplicated code)
//-uses props to pass child's value from parent component (Board)
function Square({ value }) {
    return (
        <button className="square"> {value} </button>
    );
}


//Board - component function defined to build tictactoe board using Square components
//-returns single JSX element, wrapped using Fragment (<>...</>)
//main function of file (default) accessible outside file (exported)
export default function Board() {
    return (
    <>
        <div className="board-row">
            <Square value="1" />
            <Square value="2" />
            <Square value="3" />
        </div>
        <div className="board-row">
            <Square value="4" />
            <Square value="5" />
            <Square value="6" />
        </div>
        <div className="board-row">
            <Square value="7" />
            <Square value="8" />
            <Square value="9" />
        </div>
    </>
    );
}
  