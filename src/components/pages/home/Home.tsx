import './Home.css';
import { LABELS } from '../../../constants/labels';
import { useEffect, useState } from 'react';
import postServices from '../../../services/postService';
import { Link, useNavigate, useSearchParams, } from "react-router-dom";
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';


const Home = () => {


    interface Option {
        readonly label: string;
        readonly value: string;
    }

    const createOption = (label: string) => ({
        label,
        value: label,
      });
      
      const components = {
        DropdownIndicator: null,
      };

    const handleChange = (valueChange : any, actionMeta : any) => {
        setValue(valueChange)
    }

    const [posts, setPosts] = useState<any | []>([])

    const [searchParams] = useSearchParams();

    const [totalPosts, setTotalPosts] = useState(0);

    const [popupVisible, togglePopup] = useState(false);

    const [searchTerms, setSearchTerms] = useState('');

    const [nextPageNum, setNextPageNum] = useState<number | string>(0);

    const [openSearch, toggleSearch] = useState(true);

    const [value, setValue] = useState<readonly Option[]>([]);

    const [addValue, setAddValue] = useState('');

    const navigate = useNavigate()

    const options = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
      ]

    useEffect(() => {

        var page = searchParams.get("pageNum");

        var searches = searchParams.get("searchParams");

        if(page === undefined){
            page = null
        }

        if(searches){

            setSearchTerms(searches);

            postServices.searchPosts(searches, page).then(async (res: any) => {
                if(res.data) {
                    const result: { title: string; url: string }[] = [];
                    for (let i = 0; i < res.data.rows.length; i++) {
                        const title: string = decodeURIComponent(res.data.rows[i].title);
                        const url: string = decodeURIComponent(res.data.rows[i].url);
                        result.push({ title, url });
                    }
                    setPosts(result);

                }
                console.log(res.len.rows[0].count)
                if(res.len.rows[0].count) {
                    setTotalPosts(res.len.rows[0].count);
                }
            }).catch((err: unknown) => {
                console.log(err)
            })

        }else{
            postServices.getPost(page).then(async (res: any) => {
                if (res.rows) {
                    const result: { title: string; url: string }[] = [];
                    for (let i = 0; i < res.rows.length; i++) {
                        const title: string = decodeURIComponent(res.rows[i].title);
                        const url: string = decodeURIComponent(res.rows[i].url);
                        result.push({ title, url });
                    }
                    setPosts(result);
                }
            }).catch((err : unknown) => {
                console.log(err)
            })
            postServices.getTotal().then(async (res : any) => {
                if(res.rows){
                    const result = res.rows[0]['count'];
                    setTotalPosts(result)
                }
            }).catch((err : unknown) => {
                console.log(err)
            })
        }


    }, [searchParams]);

    function togglePageNum(action : String) {

        var pageVal = 0;

        if(typeof nextPageNum === 'string' ) {
            pageVal = parseInt(nextPageNum);
        }else{
            pageVal = nextPageNum;
        }

        if (isNaN(pageVal)|| (pageVal <= 0 && action === '-')){
            setNextPageNum(0);
            return
        }

        if(action === '+') {
            setNextPageNum(pageVal+1);
        }

        if(action === '-') {    
            setNextPageNum(pageVal-1);
        }

    }

    function navigatePageNum() {

        var page = parseInt(nextPageNum.toString())

        if(isNaN(page) || (page <= Math.floor(totalPosts/30))){
            togglePopup(!popupVisible)
            navigate(`/?pageNum=${nextPageNum}`)
        }else {
            alert('Invalid input for page number')
        }
    }

    const NavigatePage = () => {
        return (
            <div style={{cursor: 'pointer'}} onClick={() => togglePopup(!popupVisible)}>...</div>
        )
    }

    function Footer(total : {total: number}) : JSX.Element {
        if(total) {

            var pages = Math.floor(total['total']/30);
            return (
                <div className='footer' >
                {pages <= 15 ? (
                (() => {
                    let rows = [];
                    for (let i = 0; i < pages; i++) {
                    if(searchTerms.length > 0) {
                        rows.push(<Link to={`?searchParams=${searchTerms}&pageNum=${i}`} key={i}>{i}</Link>);
                    }else{
                        rows.push(<Link to={`?pageNum=${i}`} key={i}>{i}</Link>);
                    }
                    }
                    return rows;
                })() 
                ) : (
                    (() => {
                        let rows = [];
                        for (let i = 0; i < 6; i++) {
                            if(searchTerms.length > 0) {
                                rows.push(<Link to={`?searchParams=${searchTerms}&pageNum=${i}`} key={i}>{i}</Link>);
                            }else{
                                rows.push(<Link to={`?pageNum=${i}`} key={i}>{i}</Link>);
                            }
                        }
                        rows.push(<NavigatePage key={pages + 1}/>)
                        for (let i = pages - 6; i < pages; i++){
                            if(searchTerms.length > 0) {
                                rows.push(<Link to={`?searchParams=${searchTerms}&pageNum=${i}`} key={i}>{i}</Link>);
                            }else{
                                rows.push(<Link to={`?pageNum=${i}`} key={i}>{i}</Link>);
                            }
                        }
                        return rows;
                    })() 
                )}
                </div>
                    )
        }
        return (
            <></>
        )
    }

    const Tags = () => {
        return (
            <CreatableSelect
            components={components}
            isClearable
            onChange={handleChange}
            isSearchable={false}
            isMulti
            menuIsOpen={false}
            placeholder=""
            value={value}
            />
        )
    }

    const searchPosts = () => {
        var searchStr = "";
        for (let i = 0; i < value.length; i++) {
            searchStr += value[i].label + ",";
        }
        searchStr = searchStr.substring(0, searchStr.length -1);
        navigate(`/?searchParams=[${searchStr}]&pageNum=${nextPageNum}`)
    }
    
    return (
        <div>
        <div className='main-container'>
            <div className='spacer'></div>
            <div className='content-container'>
                <div className='title-container'>
                <h1>{LABELS.main_title.title}</h1>
                <h2>{LABELS.main_title.subtitle}</h2>
                <h2>Last built at 2023-01-12 03:00 UTC</h2>
                </div>
                <div className='search-container'>
                <button onClick={() => toggleSearch(!openSearch)} className='search-btn'>Search</button>
                <div
            style={{
                height: openSearch ? "0px" : "200px",
                overflow: "hidden",
                display: 'flex',
                transition: "all 0.1s linear",
            }}
            >
                <div>
                <div>
                   <h3>Add Keyword:</h3> 
                    <input
                    value={addValue}
                    onChange={e => setAddValue(e.target.value)} 
                    />
                    <button onClick={() => {
                        if(addValue !== ''){
                            setValue((prev) => [...prev, createOption(addValue)])
                        }                    
                    }}>Add</button>
                </div>
                <div className={openSearch ? "close-search" : "open-search"}>
                    <h3>Add Site:</h3>
                    <Select options={options} />
                    <button>Add</button>
                </div>
                </div>
                <div>
                    <h3>
                    Keywords:
                    </h3>
                    <Tags/>
                </div>
                <button onClick={() => searchPosts()}>Get Results!</button>
            </div>
                </div>
                { posts.length > 0 ?
                <ul className='deal-list'>
                    { (posts && posts.length > 0) &&
                    posts.map((obj : {url: string, title: string}, i : number) => <a key={i} target={"_blank"} rel={'noreferrer'} href={obj.url}>{obj.title}</a>)
                    }
                </ul> 
                :
                <div>No Results Found</div>
                }
            </div>
        </div>
        <div>
                {
                    popupVisible && 
                    <div className='popup-container'>
                    <div className='popup'>
                    <div>
                        <button className='popup-add' onClick={() => togglePageNum('+')}>+</button>
                        <input 
                        key='popupKey'
                        value={nextPageNum}
                        onChange={(e) => setNextPageNum(e.target.value)}
                        className='popup-input'
                        ></input>
                        <button className='popup-sub' onClick={() => togglePageNum('-')}>-</button>
                    </div>
                    <button className='go-btn' onClick={() => navigatePageNum()}>GO</button>
                    <p><i className='down-arrow'></i></p>
                    </div>
                    </div>
                }
                {
                    (totalPosts > 0) &&
                    <Footer total={totalPosts}/>
                }
        </div>
        </div>
    )
}

export default Home;