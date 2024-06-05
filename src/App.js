// App - React component
//uses JSX elements (<button>) = JS + HTML tags combo


//Board - function defined to return 9 square buttons labeled with numbers, w/ prop className to style buttons through CSS
//-returns single JSX element, wrapped using Fragment (<>...</>)
//main function of file (default) accessible outside file (exported)
export default function Board() {
    return (
    <>
        <div className="board-row">
            <button className="square"> 1 </button>
            <button className="square"> 2 </button>
            <button className="square"> 3 </button>
        </div>
        <div className="board-row">
            <button className="square"> 4 </button>
            <button className="square"> 5 </button>
            <button className="square"> 6 </button>
        </div>
        <div className="board-row">
            <button className="square"> 7 </button>
            <button className="square"> 8 </button>
            <button className="square"> 9 </button>
        </div>
    </>
    );
}
  