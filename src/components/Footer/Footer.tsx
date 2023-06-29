import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import './Footer.css';

const Footer = (props : any) => {

    const navigate = useNavigate()

    const [popupVisible, togglePopup] = useState(false);

    let total = props.total

    let searchTerms = props.searchTerms

    let urlTerms = props.urlTerms

    if(total) {

        console.log(searchTerms)

        const NavigatePage = () => {
            return (
                <div style={{cursor: 'pointer'}} onClick={() => togglePopup(!popupVisible)}>...</div>
            )
        }

        function togglePageNum(action : String) {

            var pageVal = 0;
    
            if(typeof props.nextPageNum === 'string' ) {
                pageVal = parseInt(props.nextPageNum);
            }else{
                pageVal = props.nextPageNum;
            }
    
            if (isNaN(pageVal)|| (pageVal <= 0 && action === '-')){
                props.setNextPageNum(0);
                return
            }
    
            if(action === '+') {
                props.setNextPageNum(pageVal+1);
            }
    
            if(action === '-') {    
                props.setNextPageNum(pageVal-1);
            }
    
        }

        function navigatePageNum() {

            var page = parseInt(props.nextPageNum.toString())
    
            if(isNaN(page) || (page <= Math.floor(total/20))){
                togglePopup(!popupVisible)
                navigate(`/?pageNum=${props.nextPageNum}`)
            }else {
                alert('Invalid input for page number')
            }
        }

        var pages = Math.ceil(total/30);
        return (
            <div className='footer' >
            {   
                    popupVisible && 
                    <div className='popup-container'>
                    <div className='popup'>
                    <div className="popup-main">
                        <button className='popup-add' onClick={() => togglePageNum('+')}>+</button>
                        <input 
                        key='popupKey'
                        value={props.nextPageNum}
                        onChange={(e) => props.setNextPageNum(e.target.value)}
                        className='popup-input'
                        ></input>
                        <button className='popup-sub' onClick={() => togglePageNum('-')}>-</button>
                    </div>
                    <button className='go-btn' onClick={() => navigatePageNum()}>GO</button>
                    <p><i className='down-arrow'></i></p>
                    </div>
                    </div>
            }
            <div className="rows">
            {pages <= 15 ? (
            (() => {
                let rows = [];
                for (let i = 0; i < pages; i++) {
                if((searchTerms.length > 0) || (urlTerms.length > 0)) {
                    rows.push(<Link to={`?searchParams=${searchTerms}&urlParams=${urlTerms}&pageNum=${i}`} key={i}>{i}</Link>);
                }else{
                    rows.push(<Link to={`?pageNum=${i}`} key={i}>{i}</Link>);
                }
                }
                return (
                    <div className="single-row">
                        {rows}
                    </div>
                )
            })() 
            ) : (
                (() => {
                    let rows = [];
                    for (let i = 0; i < 5; i++) {
                        if((searchTerms.length > 0) || (urlTerms.length > 0)) {
                            rows.push(<Link to={`?searchParams=${searchTerms}&urlParams=${urlTerms}&urlParams=${urlTerms}&pageNum=${i}`} key={i}>{i}</Link>);
                        }else{
                            rows.push(<Link to={`?pageNum=${i}`} key={i}>{i}</Link>);
                        }
                    }
                    rows.push(<NavigatePage key={pages + 1}/>)
                    for (let i = pages - 6; i < pages; i++){
                        if((searchTerms.length > 0) || (urlTerms.length > 0)) {
                            rows.push(<Link to={`?searchParams=${searchTerms}&urlParams=${urlTerms}&urlParams=${urlTerms}&pageNum=${i}`} key={i}>{i}</Link>);
                        }else{
                            rows.push(<Link to={`?pageNum=${i}`} key={i}>{i}</Link>);
                        }
                    }
                    return(
                        <>
                        <div className="lower-links">
                            {rows[0]}
                            {rows[1]}
                            {rows[2]}
                            {rows[3]}
                            {rows[4]}
                        </div>
                        <div className="navigate">
                        {rows[5]}
                        </div>
                        <div className="upper-links">
                            {rows[6]}
                            {rows[7]}
                            {rows[8]}
                            {rows[9]}
                            {rows[10]}
                        </div>
                        </>
                    );
                })() 
            )}
            </div>
            </div>
                )
    }
    return (
        <></>
    )
}

export default Footer;