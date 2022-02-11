// react
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// third-party
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

// application
import PageHeader from '../shared/PageHeader';

// data stubs
import theme from '../../data/theme';
import message_ar from '../../data/messages_ar'
import message_en from '../../data/messages_en'
import terms from '../../data/termsAndConditions'


function SitePageTerms () {
    const locale = useSelector( state => state.locale )
    const [messages, setMessages] = useState( locale === 'ar' ? message_ar : message_en || message_ar )
    
    useEffect( () => {
        setMessages( locale === 'ar' ? message_ar : message_en || message_ar )
    }, [locale] )


    const breadcrumb = [
        { title: messages.home, url: '' },
        { title: messages.termsAndCondition, url: '/site/terms' },
    ];

    return (
        <React.Fragment>
            <Helmet>
                <title>{`Terms And Conditions — ${theme.name}`}</title>
            </Helmet>

            <PageHeader breadcrumb={breadcrumb} />

            <div className="block">
                <div className="container">
                    <div className="document">
                        <div className="document__header">
                            <h1 className="document__title">{ messages.termsAndCondition}</h1>
                            {/* <div className="document__subtitle">This Agreement was last modified on 27 May 2018.</div> */}
                        </div>
                        <div className="document__content typography">
                            <p>
                               نحن (ايجي ھوم ) نرحب بزيارتك لھذا الموقع ونسعد بتقديم جميع المعلومات والخدمات، وفيما يلي 
البنود والقيود القانونية المفروضة على جميع زائري ھذا الموقع والمواقع ذات الصلة :-
                            </p>

                            {/* <h2>Definitions</h2> */}

                            <ol>
                                {terms.map( ( term, idx ) => {
                                    return(idx<=18&&(<li>
                                         {term}
                                    </li>) )
                                    
                                } )}
                                
                                <li>
                                    <strong>لك الحق في استبدال السلعة أو إعادتھا خلال ١٤ يوم من تسلمھا و ذلك بشرط :</strong>
                                    <ol>
                                        <li> أن يكون بھا عيب صناعه أو غير مطابقه للمواصفات أو للغرض الذي تم التعاقد عليھا من أجله </li>
                                        <li> 
ً بالغلاف الاصلي .
                                            • في حالة الاسترجاع والاستبدال يشترط ان يكون المنتج بنفس حالته عند البيع ومغلفا</li>
                                        <li>تقديم أصل فاتورة البيع .</li>
                                        <li>تكون طريقة استرداد القيمة بنفس طريقة الدفع </li>
                                        <li>من حق العميل استبدال السلعة بأخري بذات القيمة المدونة علي الفاتورة او اكثر مع دفع فرق القيمة .</li>
                                        <li>تقوم سوناي باستبدال مطابق للجھاز في حالة العيب في التصنيع وليس عيوب ناتجة عن سوء الاستخدام .</li>
                                        <li> في حالة طلب إعادة بعض او كل الاصناف المشتراه خلال فترة ١٤ يوم من تاريخ الشراء يتم خصم إجمالي تكلفة 
الشحن (للتوصيل والاسترجاع) على ان يكون المنتج بالحالة الاصلية عند التسليم للعميل وبمواد التعبئة والتغليف 
الاصليين</li>
                                    </ol>
                                </li>

                                <li>
                                    <strong>إذا كانت أية فقرة واردة في اتفاقية المستخدم ھذه غير صالحة أو ملغاة أو أنھا لأي سبب لم تعد نافذة، فإن مثل ھذه 
الفقرة لا تلغي صلاحية بقية الفقرات الواردة في الاتفاقية. ھذه الاتفاقية (والتي تعدل بين حين وآخر بحسب بنودھا) 
                                        تضع كافة الخطوط العريضة للتفا ھم والاتفاق بينك وبين موقع ايجي ھوم مع الاعتبار لما يلي :</strong>
                                    <ol>
                                        <li>
 ليس من حق أي شخص لا يكون طرفا
ً في اتفاقية المستخدم ھذه أن يفرض أية بنود أو شروط فيھا .
                                        </li>
                                        <li>
                                            إذا تمت ترجمة اتفاقية المستخدم لأي لغة أخرى غير العربية، سواء على الموقع أو بطرق أخرى، فإن النص 
العربي لھا يظل ھو السائد 
                                        </li>
                                    </ol>
                                </li>

                                <li>
                                    <strong>موقع ايجي ھوم بموجب ھذه الشروط وبحسب ال وبدون تحمله المسؤولية إلى تحديد نشاطك أو 
قانون قد يلجأ حالاً
                                        إلى وقف مؤقت أو دائم وذلك دون الإضرار بحقوقه الأخرى وذلك في حالة :</strong>
                                    <ol>
                                        <li>إذا انتھكت اتفاقية الاستخدام .</li>
                                        <li> إذا لم يكن بإمكان موقع ايجي ھوم توثيق أي من معلوماتك المقدمة إليه </li>
                                        <li>إذا تسبب نشاطك في أي إشكالات قانونية </li>
                                    </ol>
                                </li>

                                {terms.map( ( term, idx ) => {
                                    return(idx>19&&(<li>
                                         {term}
                                    </li>) )
                                    
                                } )}
                                
                                
                            </ol>

                            <h2>{ messages.contactUs}</h2>

                            <p>
                                للمزيد من المعلومات عن كيفيه التواصل معنا &nbsp;
                                <Link to="/site/contact-us">أضغط هنا</Link>
                                .
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default SitePageTerms;
