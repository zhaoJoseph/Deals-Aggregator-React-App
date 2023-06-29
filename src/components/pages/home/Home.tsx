import './Home.css';
import { LABELS } from '../../../constants/labels';
import { useEffect, useState } from 'react';
import postServices from '../../../services/postService';
import {  useSearchParams, } from "react-router-dom";
import CustomOptionSelect from '../../Select/CustomOptionSelect';
import Footer from '../../Footer/Footer';

const Home = () => {


    const [posts, setPosts] = useState<any | []>([])

    const [searchParams] = useSearchParams();

    const [buildTime, setBuildTime] = useState('');

    const [totalPosts, setTotalPosts] = useState(0);

    const [searchTerms, setSearchTerms] = useState('');

    const [urlTerms, setUrlTerms] = useState('');
 
    const [nextPageNum, setNextPageNum] = useState<number | string>(0);

    useEffect(() => {

        postServices.getBuild().then(async (res: any) => {
            if(res){

                var utcTime = new Date(res.time)

                setBuildTime(utcTime.toUTCString())
            }

        }).catch((err: unknown) => {
                console.log(err)
        })

        var page = searchParams.get("pageNum");

        var searches = searchParams.get("searchParams");

        var urls = searchParams.get("urlParams");

        var terms = ''

        if(page === undefined){
            page = null
        }

        if(searches){
            terms += searches;
            setSearchTerms(searches);
        }

        if(urls) {
            terms += urls;
            setUrlTerms(urls)
        } 

        if(terms){

            postServices.searchPosts(searches, urls, page).then(async (res: any) => {
                if(res.data) {
                    const result: { title: string; url: string }[] = [];
                    for (let i = 0; i < res.data.rows.length; i++) {
                        const title: string = decodeURIComponent(res.data.rows[i].title);
                        const url: string = decodeURIComponent(res.data.rows[i].url);
                        result.push({ title, url });
                    }
                    setPosts(result);

                }
                if(res.len.rows[0].count) {
                    console.log(res.len.rows[0].count)
                    setTotalPosts(res.len.rows[0].count);
                }
            }).catch((err: unknown) => {
                console.log(err)
            })

        }else{

            setSearchTerms('')

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
    
    return (
        <div>
        <div className='main-container'>
            <div className='spacer'></div>
            <div className='content-container'>
                <div className='title-container'>
                <h1 className='main-header'>{LABELS.main_title.title}</h1>
                <h2 className='description'>{LABELS.main_title.subtitle}</h2>
                <h2 className='build-time'>Last built at {buildTime}</h2>
                </div>
                <CustomOptionSelect nextPageNum={nextPageNum}/>
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
        <div className='footer-container'>
                {
                    (totalPosts > 0) &&
                    <Footer 
                    total={totalPosts}
                    searchTerms={searchTerms}
                    urlTerms={urlTerms}
                    setNextPageNum={setNextPageNum}
                    nextPageNum={nextPageNum}
                    />
                }
        </div>
        </div>
    )
}

export default Home;