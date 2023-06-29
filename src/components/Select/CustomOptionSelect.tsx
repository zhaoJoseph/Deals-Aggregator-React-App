import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { useState } from 'react';
import { useNavigate, } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import './Select.css';

const CustomOptionSelect = (props: any) => {
    interface Option {
        readonly label: string;
        readonly value: string;
        readonly site: Number;
    }

    const createOption = (label: string, value: string, site: Number) => ({
        label : label,
        site: site,
        value: value,
      });
      
      const components = {
        DropdownIndicator: null,
      };

      const [value, setValue] = useState<readonly Option[]>([]);
      const [siteValue, setSiteValue] = useState<readonly Option[]>([]);
      const [openSearch, toggleSearch] = useState(true);
      const [addValue, setAddValue] = useState('');
      const navigate = useNavigate()


      const options = [
        { value: 'site:Amazon', label: 'amazon.ca', site: 1},
        { value: 'site:Steam', label: 'steampowered.com', site: 1},
        { value: 'site:Epic', label: 'epicgames.com', site: 1}
      ]

    const handleChange = (valueChange : any, actionMeta : any) => {
        setValue(valueChange)
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
        var urlStr= "";
        for (let i = 0; i < value.length; i++) {
            if(!value[i].site){
                searchStr += value[i].label + ",";
            }else {
                urlStr += value[i].value + ",";
            }
        }
        searchStr = searchStr.substring(0, searchStr.length -1);
        urlStr = urlStr.substring(0, urlStr.length - 1);
        navigate(`/?searchParams=[${searchStr}]&urlParams=[${urlStr}]&pageNum=0`)
    }

    return (
        <div className='search-container'>
                <button onClick={() => toggleSearch(!openSearch)} className='search-btn'>Advanced Search <AiOutlineSearch className='search-icon'/></button>
                <div
            style={{
                height: openSearch ? "0px" : "300px",
                overflow: "hidden",
                display: 'flex',
                transition: "all 0.1s linear",
            }}
            >
                <div className='search-box'>
                <div className='selections'>
                <div>
                   <h3>Add Keyword:</h3> 
                    <input
                    value={addValue}
                    onChange={e => setAddValue(e.target.value)} 
                    />
                    <button onClick={() => {
                        if(addValue !== ''){
                            setValue((prev) => [...prev, createOption(addValue, addValue, 0)])
                        }                    
                    }}>Add</button>
                </div>
                <div>

                    <h3>Add Site:</h3>
                    <div className='site-div'>
                    <Select options={options} value={siteValue} onChange={e => (e !== null) ? setSiteValue([e]) : setSiteValue([])} />
                    <button onClick={() => {
                        if((siteValue.length > 0) && !(value.filter(e => e.value === siteValue[0].value).length > 0)){
                            setValue((prev) => [...prev, createOption(siteValue[0].value, siteValue[0].label, 1)])
                        }                    
                    }}>Add</button> 
                    </div>
                </div>
                </div>
                <div>
                    <h3>
                    Keywords:
                    </h3>
                    <Tags/>
                </div>
                </div>
                <button className='submit' onClick={() => searchPosts()}>Get Results!</button>
            </div>
        </div>
    )
}

export default CustomOptionSelect;