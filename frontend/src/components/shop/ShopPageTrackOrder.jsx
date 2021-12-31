// react
import React,{useState,useEffect} from 'react';

// third-party
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import {toast} from 'react-toastify'

// application
import PageHeader from '../shared/PageHeader';
import{checkTrackOrderAction} from '../../store/order'
import { useLocation } from 'react-router';



// data stubs
import theme from '../../data/theme';


function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function ShopPageTrackOrder ( { history, params } ) {
    const query = useQuery();

    console.log(params)
    const breadcrumb = [
        { title: 'الرئيسية', url: '/' },
        { title: 'تتبع طلبك', url: '' },
    ];

    const[orderId,setOrderId]=useState()

    const checkTrackOrder = useSelector((state) => state.checkTrackOrder);
    const { error, loading, success } = checkTrackOrder;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const dispatch = useDispatch();
    
    useEffect( () => {
        if ( !userInfo ) {
            history.push('/account/login')
        }

        if ( error ) {
            toast.error( 'هذا الطلب غير موجود', { theme: 'colored' } )
        }

        if ( success ) {
            history.push(`/shop/track/${orderId}`)
        }

        
        

    }, [dispatch, userInfo,error,success] );
    
    const submitHandler = ( e ) => {
        e.preventDefault();
        dispatch(checkTrackOrderAction(orderId));
    }
  

    return (
        <React.Fragment>
            <Helmet>
                <title>تتبع طلبك</title>
            </Helmet>

            <PageHeader breadcrumb={breadcrumb} />

            <div className="block">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-5 col-lg-6 col-md-8">
                            <div className="card flex-grow-1 mb-0 mt-lg-4 mt-md-3 mt-2">
                                <div className="card-body">
                                    <div className="card-title text-center"><h1 className="pt-lg-0 pt-2">استعلم عن حالة طلبك</h1></div>
                                    <p className="mb-4 pt-2">
                                        يمكنك متابعه عمليه الشراء الخاصة بك عن طريق إدخال الرقم التعريفى الخاص بطلبك أسفل حيث يمكنك ايجادة فى قائمة الطلبات الخاصة بك , سنقوم
                                        بإرسال بريد الى بريدك الاكترونى فى حال صحة البيانات
                                    </p>
                                    <form>
                                        <div className="form-group">
                                            <label htmlFor="track-order-id">الرقم التعريفى الخاص بطلبك</label>
                                            <input id="track-order-id"
                                                type="text"
                                                className="form-control"
                                                placeholder="الرقم التعريفى الخاص بطلبك"
                                                value={orderId}
                                                onChange={e=>setOrderId(e.target.value)}
                                            />
                                        </div>
                                        <div className="pt-3">
                                            <button
                                                type="submit"
                                                className="btn btn-primary btn-lg btn-block"
                                                onClick={e => submitHandler( e )}
                                                disabled={!orderId?true:false}
                                            >إستعلام</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default ShopPageTrackOrder;
