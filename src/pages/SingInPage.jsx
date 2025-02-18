console.clear();
import axios from "axios";
import { useState } from "react";

const baseApi = import.meta.env.VITE_BASE_URL;

function SigninPage({ setIsAuth }) {
    const [resErrMessage, setResErrMessage] = useState("");
    const [account, setAccount] = useState({
        "username": "user@exapmle.com",
        "password": "example"
    });

    // 處理登入的input
    const handleSignInInputChange = (e) => {
        const { value, name } = e.target;
        setAccount({
            ...account,
            [name]: value
        });
    };

    // 監聽登入按鈕
    const handleSingIn = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${baseApi}/v2/admin/signin`, account);
            const { token, expired } = res.data;
            document.cookie = `signInHexoToken = ${token}; expires = ${new Date(expired)}`;
            axios.defaults.headers.common['Authorization'] = token;
            setIsAuth(true);
        }
        catch (error) {
            setResErrMessage(error.response?.data?.message);
            console.error(error);
        }
    };

    return (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
            <h2 className="mb-4">請先登入</h2>
            <form onSubmit={handleSingIn}>
                <div className="form-group">
                    <label htmlFor="exampleInputEmail2">電子郵件</label>
                    <input
                        name="username"
                        value={account.username}
                        type="email"
                        className="form-control"
                        id="exampleInputEmail2"
                        placeholder="請輸入信箱"
                        onChange={handleSignInInputChange}
                    />
                </div>
                <div className="form-group my-3">
                    <label htmlFor="exampleInputPassword2">密碼</label>
                    <input
                        name="password"
                        value={account.password}
                        type="password"
                        className="form-control"
                        id="exampleInputPassword2"
                        placeholder="請輸入密碼"
                        onChange={handleSignInInputChange}
                    />
                </div>
                {resErrMessage && (<p className="text-danger" >{resErrMessage}</p>)}
                <button className="btn btn-success" >
                    登入
                </button>
            </form>
        </div>
    )
}

export default SigninPage;