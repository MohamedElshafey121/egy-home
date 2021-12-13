import React, { useEffect } from 'react';
import Price from "../shared/Price";
import { useSelector, useDispatch } from 'react-redux'
import { getOrder } from "../../store/order";
// import BlockLoader from '../blocks/BlockLoader';
import BlockLoader from '../../components/blocks/BlockLoader'

import InvoiceLogo from "./InvoiceLogo";

export default function OrderInvoice ({match}) {
    useEffect( () => {
        window.stroyka.containerQuery();
    }, [] );

    const orderId = match.params.id;
  const order = useSelector((state) => state.order);
    const { order: userOrder, loading } = order;
    
  const dispatch = useDispatch();
    //load Order
    useEffect( () => {
        if ( !userOrder ) {
            dispatch( getOrder( orderId ) );
        } else {
            if ( orderId !== userOrder._id ) {
                dispatch( getOrder( orderId ) );   
            }
        }

    }, [orderId] );

    if ( loading ) {
        return <BlockLoader/>
    }

    const items = ( userOrder && userOrder.orderItems ) && ( userOrder.orderItems.map( ( item, itemIdx ) => (
        <tr key={itemIdx}>
            <td className="sa-invoice__table-column--type--product">
                {item.name}
            </td>
            <th className="sa-invoice__table-column--type--unit"></th>
            <td className="sa-invoice__table-column--type--price">
                <Price value={item.price} />
            </td>
            <td className="sa-invoice__table-column--type--quantity"> {item.qty} </td>
            <td className="sa-invoice__table-column--type--total">
                <Price value={ item.qty*item.price}/>
            </td>
        </tr>
    ) ) );

    const prices = ( userOrder && userOrder.itemsPrice ) && (
        <>
            <tr>
                <th className="sa-invoice__table-column--type--header" colSpan={4}>Subtotal</th>
                <td className="sa-invoice__table-column--type--total">
                    <Price value={userOrder.itemsPrice} />
                </td>
            </tr>
            <tr>
                <th className="sa-invoice__table-column--type--header" colSpan={4}>Shipping</th>
                <td className="sa-invoice__table-column--type--total">
                    <Price value={userOrder.shippingPrice} />
                </td>
            </tr>
        </>
    );

    return (
        <React.Fragment>
            <div id="top" class="sa-app__body">
                <div className="sa-invoice">
                    <div className="sa-invoice__card">
                        <div className="sa-invoice__header">
                            <div className="sa-invoice__meta">
                                <div className="sa-invoice__title">{( userOrder && userOrder._id ) && ( <> Order Id <br /> &nbsp; &nbsp; #{userOrder._id}</> )}</div>
                                <div className="sa-invoice__meta-items">
                                    <span>Order date:</span> {( userOrder && userOrder.createdAt ) && (
                                        new Date( userOrder.createdAt ).toDateString()
                                    )}<br />
                                    {/* <span>Due date:</span> Nov 19, 2020<br /> */}
                                </div>
                            </div>
                            <div className="sa-invoice__logo">
                                <InvoiceLogo />
                            </div>
                        </div>
                        <div className="sa-invoice__sides">
                            {userOrder && (
                                <div className="sa-invoice__side">
                                    <div className="sa-invoice__side-title">Invoice To</div>
                                    <div className="sa-invoice__side-name">{userOrder.shippingAddress.firstName} {userOrder.shippingAddress.lastName}</div>
                                    <div className="sa-invoice__side-meta">
                                        {userOrder.shippingAddress.governate}
                                        {userOrder.shippingAddress.city}
                                        {userOrder.shippingAddress.area}
                                        ,
                                        {userOrder.shippingAddress.address}<br />
                                        {userOrder.phone} , {(userOrder.user)&&userOrder.user.email}
                                    </div>
                                </div>
                            )}

                            <div className="sa-invoice__side">
                                <div className="sa-invoice__side-title">Invoice From</div>
                                <div className="sa-invoice__side-name">Egy-Home.</div>
                                <div className="sa-invoice__side-meta">
                                    715 Fake Street, New York 10021 USA<br />
                                    +0 800 306-8265, stroyka@example.com
                                </div>
                            </div>
                        </div>
                        <div className="sa-invoice__table-container">
                            <table className="sa-invoice__table">
                                <thead className="sa-invoice__table-head">
                                    <tr>
                                        <th className="sa-invoice__table-column--type--product">Product / Service</th>
                                        <th className="sa-invoice__table-column--type--unit"></th>
                                        <th className="sa-invoice__table-column--type--price">Price</th>
                                        <th className="sa-invoice__table-column--type--quantity">Qty</th>
                                        <th className="sa-invoice__table-column--type--total">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="sa-invoice__table-body">
                                        {items}
                                </tbody>
                                <tbody className="sa-invoice__table-totals">
                                    {prices}
                                </tbody>
                            </table>
                        </div>
                        <div className="sa-invoice__total">
                            <div className="sa-invoice__total-title">Total Amount:</div>
                            <div className="sa-invoice__total-value">
                                <Price value={ userOrder?userOrder.totalPrice:0} />
                            </div>
                        </div>
                        <div className="sa-invoice__disclaimer">
                            Information on technical characteristics, the delivery set, the country of manufacture and
                            the appearance of the goods is for reference only and is based on the latest information
                            available at the time of publication.
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
