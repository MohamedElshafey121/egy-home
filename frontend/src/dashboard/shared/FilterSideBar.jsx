import React from 'react'
import PropType from 'prop-types';


function FilterSideBar({filters}) {
    return (
        <div>
            <>
            <div className="sa-layout__sidebar-header">
                <div className="sa-layout__sidebar-title">Filters</div>
                <button
                    type="button"
                    className="sa-close sa-layout__sidebar-close"
                    aria-label="Close"
                    data-sa-layout-sidebar-close=""
                />
            </div>
            <div className="sa-layout__sidebar-body sa-filters" data-simplebar>
                <ul className="sa-filters__list"  >
                    {filters &&filters.map( ( filter, filterIdx ) => (
                        <li key={filterIdx} className="sa-filters__item">
                            <div className="sa-filters__item-title">{filter.title}</div>
                            <div className="sa-filters__item-body">
                                {['check', 'radio'].includes( filter.type ) && (
                                    <ul className="list-unstyled m-0 mt-n2">
                                        {filter.items?.map( ( item, itemIdx ) => (
                                            <li key={itemIdx}>
                                                <label className="d-flex align-items-center pt-2">
                                                    {filter.type === 'check' && (
                                                        <>
                                                            {
                                                                filter.key === 'categories' ? (
                                                                    <input type="checkbox" className="form-check-input m-0 me-3 fs-exact-16" defaultChecked={(selectedcategory&&item._id===selectedcategory._id)&&true} style={{ position: 'relative' }} onClick={e => categoryPushHandler( e, item._id )} />
                                                                
                                                                ) : filter.key === 'brands' ? (
                                                                    <input type="checkbox" className="form-check-input m-0 me-3 fs-exact-16" defaultChecked={item.checked} style={{ position: 'relative' }} onClick={e => brandPushHandler( e, item._id )} />
                                                                
                                                                    ) : <input type="checkbox" className="form-check-input m-0 me-3 fs-exact-16" defaultChecked={item.checked} style={{ position: 'relative' }} />
                                                                
                                                            }
                                                          
                                                        </>
                                                    )}
                                                    {filter.type === 'radio' && (
                                                    <>
                                                        {
                                                            filter.key === 'visibility' ? (
                                                                <input type="radio" value={item.value} className="form-check-input m-0 me-3 fs-exact-16" onClick={e=>VisibilityPushHandler(e.target.value)} defaultChecked={item.value.toLocaleLowerCase()===visibility.toLocaleLowerCase()} name={`filter-${ filter.key }`} style={{ position: 'relative' }} />
                                                            ) : (
                                                                    <input type="radio" className="form-check-input m-0 me-3 fs-exact-16" defaultChecked={item.checked} name={`filter-${ filter.key }`} style={{ position: 'relative' }} />
                                                            )
                                                        }
                                                    </>
                                                    )}

                                                    {item.name ? item.name : item.label}
                                                </label>
                                            </li>
                                        ) )}
                                    </ul>
                                )}
                                {filter.type === 'range' && (
                                    <div
                                        className="sa-filter-range"
                                        data-min={filter.min}
                                        data-max={filter.max}
                                        data-from={filter.from}
                                        data-to={filter.to}
                                    >
                                        <div className="sa-filter-range__slider" />

                                        <input type="hidden" value={filter.from} className="sa-filter-range__input-from" />
                                        <input type="hidden" value={filter.to} className="sa-filter-range__input-to" />
                                    </div>
                                )}
                            </div>
                        </li>
                    ) )}
                </ul>
            </div>
        </>
    
        </div>
    )
}

FilterSideBar.PropType = {
    filters:PropType.object
}

export default FilterSideBar
