import axios from "axios";
import { useState, useEffect } from "react";
import SigninPage from "./pages/singInPage";
import ProductsPage from "./pages/ProductsPage";
const baseApi = import.meta.env.VITE_BASE_URL;

function App() {
    const [isAuth, setIsAuth] = useState(false);
    // 驗證登入
    const authSignIn = async (e) => {
        try {
            await axios.post(`${baseApi}/v2/api/user/check`);
            // getProducts();
            setIsAuth(true);
        }
        catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const token = document.cookie.replace(
            /(?:(?:^|.*;\s*)signInHexoToken\s*\=\s*([^;]*).*$)|^.*$/,
            "$1",
        );
        axios.defaults.headers.common['Authorization'] = token;
        authSignIn();
    }, []);

    return (
        <>
            {
                isAuth ? <ProductsPage /> : <SigninPage setIsAuth={setIsAuth} />
            }
        </>

    );
};

export default App;