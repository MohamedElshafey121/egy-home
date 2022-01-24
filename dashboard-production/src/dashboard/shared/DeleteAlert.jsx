import React from 'react'
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import {
    deleteOneBrand
} from "../../store/brand";

function DeleteAlert ( props ) {
    const { openDeleteAlert, openDeleteAlertHandler, deleteItemType, deleteItemId } = props;
    const dispatch = useDispatch()
    
    const deleteItemAction = () => {
        if ( deleteItemType === 'brand' ) {
            // alert( deleteItemId )
            dispatch( deleteOneBrand( deleteItemId ) ).then( () => {
                openDeleteAlertHandler(false)
            })
        }
    };

    return (
        <React.Fragment>
        <div className={classNames("modal",{"d-block":openDeleteAlert})} tabindex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Warning You are about to delete this item</h5>
                    </div>
                    <div className="modal-body">
                        <p>by deleting this item you will be unable to recover it again</p>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            data-dismiss="modal"
                            onClick={e=>openDeleteAlertHandler(false)}
                        >Close</button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={deleteItemAction}
                        >Delete</button>
                    </div>
                </div>
            </div>
            </div>
            </React.Fragment>
    )
}

export default DeleteAlert
