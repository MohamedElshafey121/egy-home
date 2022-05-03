import axios from "axios";
import { toast } from "react-toastify";
import { ONLINE_PAYMENT_SUCCESS } from "./paymentActionTypes";

const formdata = {
    amount: {
        currency: "EGP",
        total: 400,
    },
    bankcard: {
        cardHolderName: "Amr ahmed yousef",
        cardNumber: "5078034813034621",
        cvv: "329",
        enable3DS: true,
        expiryMonth: "07",
        expiryYear: "26",
    },
    callbackUrl: "https://your-call-back-url.com",
    country: "EG",
    payMethod: "BankCard",
    product: {
        description: "description",
        name: "name",
    },
    reference: "041233989101",
    returnUrl: "https://your-return-url.com",
};

// const formdata = {
//     amount: {
//         currency: "EGP",
//         total: 400,
//     },
//     bankcard: {
//         cardHolderName: "Amr ahmed yousef",
//         cardNumber: "4508750015741019",
//         cvv: "100",
//         enable3DS: true,
//         expiryMonth: "05",
//         expiryYear: "25",
//     },
//     callbackUrl: "https://your-call-back-url.com",
//     country: "EG",
//     payMethod: "BankCard",
//     product: {
//         description: "description",
//         name: "name",
//     },
//     reference: "041233989101",
//     returnUrl: "https://your-return-url.com",
// };

// function handleOnlinePayment() {
//     return async (dispatch, getState) => {
//         try {
//             const {
//                 userLogin: { userInfo },
//             } = getState();
//             // console.log(userInfo);

//             const { data } = await axios.post("/payment/signature", formdata);
//             const signature = data.data.signature;

//             const config = {
//                 mode: "no-cors",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${signature}`,
//                     MerchantId: 281822041888389,
//                     "Access-Control-Allow-Origin": "*",
//                 },
//             };

//             const res = await axios.post(`/payment/pay/${signature}`, formdata);
//             // const res = await axios.post(
//             //     "https://sandboxapi.opaycheckout.com/api/v1/international/payment/create",
//             //     formdata,
//             //     config
//             // );

//             console.log("res ", res);
//             // fetch("https://sandboxapi.opaycheckout.com/api/v1/international/payment/create", {
//             //     method: "POST",
//             //     mode: "no-cors",
//             //     headers: {
//             //         "Content-Type": "application/json",
//             //         Authorization: `Bearer ${signature}`,
//             //         MerchantId: 281822041888389,
//             //     },
//             //     body: formdata,
//             // })
//             //     .then((data) => {
//             //         console.log("data", data);
//             //         return data.json();
//             //     })
//             //     .then((res) => {
//             //         console.log(res);
//             //     })
//             //     .catch((err) => {
//             //         console.log(err);
//             //     });
//         } catch (error) {
//             console.log("Error * ", error);
//         }
//     };
// }

function handleOnlinePayment(formdata) {
    return async (dispatch, getState) => {
        try {
            const { data } = await axios.post(`/payment/checkout`, formdata);
            if (data.data.code === "00000") {
                const cashierUrl = data.data.data.cashierUrl;
                window.location.href = cashierUrl;
            } else {
                toast.error(data.data.message, { theme: "colored" });
            }
        } catch (err) {
            console.log("Error", err);
        }
    };
}
export { handleOnlinePayment };
