// react
import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

// third-party
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';

// application
import shopApi from '../../api/shop';
import Suggestions from './Suggestions';
import { Cross20Svg, Search20Svg } from '../../svg';

import {
    getSearchCategories,
    getSuggestedSearchProducts
} from "../../store/homePage"



function Search ( props ) {

    const searchCategories = useSelector( state => state.searchCategories )
    const { categories } = searchCategories;

    // const suggestedSearchProducts = useSelector( state => state.suggestedSearchProducts );
    // const { loading, products:suggestedProducts, error} = suggestedSearchProducts;
    
    const {
        context,
        className,
        inputRef,
        onClose,
        location,
        history
    } = props;
    const [cancelFn, setCancelFn] = useState(() => () => {});
    const [suggestionsOpen, setSuggestionsOpen] = useState(false);
    const [hasSuggestions, setHasSuggestions] = useState(false);
    const [suggestedProducts, setSuggestedProducts] = useState([]);
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState(null);
    // const categories = useCategories();
    const wrapper = useRef(null);
    const close = useCallback(() => {
        if (onClose) {
            onClose();
        }

        setSuggestionsOpen(false);
    }, [onClose]);

    const dispatch = useDispatch()
    //load categories
    useEffect( () => {
        if ( !categories ) {
            dispatch( getSearchCategories() )
        }
    }, [ dispatch, categories] )

    // Close suggestions when the location has been changed.
    useEffect( () => {
        close()
    }, [close, location] );

    // Close suggestions when a click has been made outside component.
    useEffect(() => {
        const onGlobalClick = (event) => {
            if (wrapper.current && !wrapper.current.contains(event.target)) {
                close();
            }
        };

        document.addEventListener('mousedown', onGlobalClick);

        return () => document.removeEventListener('mousedown', onGlobalClick);
    }, [close]);

    // Cancel previous typing.
    useEffect(() => () => cancelFn(), [cancelFn]);

    const handleFocus = () => {
        setSuggestionsOpen(true);
    };

    const handleChangeCategory = (event) => {
        setCategory(event.target.value);
    };

    //on change 
    const handleChangeQuery = (event) => {
        let canceled = false;
        let timer;

        const newCancelFn = () => {
            canceled = true;
            clearTimeout(timer);
        };

        const query = event.target.value;

        setQuery(query);

        if (query === '') {
            setHasSuggestions(false);
        } else {
            timer = setTimeout(() => {
                dispatch( getSuggestedSearchProducts( query ,category) ).then( ( products ) => {
                    if ( canceled ) {
                        return;
                    }
                    setSuggestedProducts(products)
                    if ( products ) {
                        setHasSuggestions( products.length > 0 );
                    }
                    setSuggestionsOpen( true );
                } );
            }, 100);
        }

        setCancelFn(() => newCancelFn);
    };

    const handleBlur = () => {
        setTimeout(() => {
            if (!document.activeElement || document.activeElement === document.body) {
                return;
            }

            // Close suggestions if the focus received an external element.
            if (wrapper.current && !wrapper.current.contains(document.activeElement)) {
                close();
            }
        }, 10);
    };

    const handleSubmit = ( e ) => {
        e.preventDefault();
        if ( query.trim() === '' ) {
            history.push(`/shop/catalog`)
        } else {
            if ( category ) {
                history.push(`/shop/catalog?name=${query}&c=${category}`)
            } else {
                history.push(`/shop/catalog?name=${query}`)
            }
        }
    }

    // Close suggestions when the Escape key has been pressed.
    const handleKeyDown = (event) => {
        // Escape.
        if (event.which === 27) {
            close();
        }
    };

    const rootClasses = classNames(`search search--location--${context}`, className, {
        'search--suggestions-open': suggestionsOpen,
        'search--has-suggestions': hasSuggestions,
    });

    const closeButton = context !== 'mobile-header' ? '' : (
        <button className="search__button search__button--type--close" type="button" onClick={close}>
            <Cross20Svg />
        </button>
    );

            
    const categoryOptions = categories&& categories.map((category,categoryIdx) => (
        <option key={categoryIdx} value={category._id}>
            {category.name}
        </option>
    ));

    return (
        <div className={rootClasses} ref={wrapper} onBlur={handleBlur}>
            <div className="search__body">
                <form className="search__form" action="" onSubmit={handleSubmit}>
                    {context === 'header' && (
                        <select
                            className="search__categories"
                            aria-label="Category"
                            value={category}
                            onFocus={close}
                            onChange={handleChangeCategory}
                        >
                            <option value=''> الأقسام </option>
                            {categoryOptions}
                        </select>
                    )}
                    <input
                        ref={inputRef}
                        onChange={handleChangeQuery}
                        onFocus={handleFocus}
                        onKeyDown={handleKeyDown}
                        value={query}
                        className="search__input"
                        name="search"
                        placeholder="اكتب أسم المنتج..."
                        aria-label="Site search"
                        type="text"
                        autoComplete="off"
                    />
                    <button className="search__button search__button--type--submit" type="submit" onClick={handleSubmit}>
                        <Search20Svg />
                    </button>
                    {closeButton}
                    <div className="search__border" />
                </form>

                <Suggestions className="search__suggestions" context={context} products={suggestedProducts} />
            </div>
        </div>
    );
}

export default withRouter(Search);
