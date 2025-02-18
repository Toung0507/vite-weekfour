import axios from "axios";
import { useEffect, useState } from "react";
import Paginations from "../components/Pagination";
import ProductModal from "../components/ProductModal";
import DelProductModal from "../components/DelProductModal";

const baseApi = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

const defaultModalState = {
    imageUrl: "",
    title: "",
    category: "",
    unit: "",
    origin_price: "",
    price: "",
    description: "",
    content: "",
    is_enabled: 0,
    imagesUrl: [""]
};

function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [tempProduct, setTempProduct] = useState(defaultModalState);
    const [modalMode, setModalMode] = useState(null);
    const [pageInfo, setPageInfo] = useState({});
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isDelProductModalOpen, setIsDelProductModalOpen] = useState(false);

    // 抓取產品資料
    const getProducts = async (page) => {
        try {
            const res = await axios.get(`${baseApi}/v2/api/${apiPath}/admin/products?page=${page}`);
            setProducts(res.data.products);
            setPageInfo(res.data.pagination);
        }
        catch (error) {
            console.error(error);
        }
    };

    // 更換頁面 按鈕
    const handleChangePage = (page) => {
        getProducts(page);
    };

    // 顯示Modal - 編輯跟新增
    const handleShowProductModal = (mode, product) => {
        setModalMode(mode);
        if (mode == 'edit') {
            setTempProduct(product);
        }
        else if (mode == 'create') {
            setTempProduct(defaultModalState);
        }
        setIsProductModalOpen(true);
    };

    // 顯示Modal - 刪除
    const handleShowDelProductModal = (product) => {
        setTempProduct(product);
        setIsDelProductModalOpen(true);
    };

    useEffect(() => {
        getProducts();
    }, []);

    return (
        <>
            <div className="container">
                <div className="row mt-3">
                    <div className="col">
                        <div className="d-flex justify-content-between">
                            <h2>產品列表</h2>
                            <button className="btn btn-primary" onClick={() => handleShowProductModal('create')}>
                                新增產品
                            </button>
                        </div>
                        <table className="table text-center table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>產品名稱</th>
                                    <th>原價</th>
                                    <th>售價</th>
                                    <th>是否啟用</th>
                                    <th>管理</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.title}</td>
                                        <td>{item.origin_price}</td>
                                        <td>{item.price}</td>
                                        <td>{item.is_enabled ? (<span className="text-success">啟用</span>) : (<span className="text-danger">未啟用</span>)}</td>
                                        <td>
                                            <div className="btn-group">
                                                <button
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={() => handleShowProductModal('edit', item)}
                                                >
                                                    編輯
                                                </button>
                                                <button
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() => handleShowDelProductModal(item)}
                                                >
                                                    刪除
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Paginations pageInfo={pageInfo} handleChangePage={handleChangePage} />
                    </div>
                </div>
            </div>
            <ProductModal
                isOpen={isProductModalOpen}
                setIsOpen={setIsProductModalOpen}
                modalMode={modalMode}
                tempProduct={tempProduct}
                getProducts={getProducts} />
            <DelProductModal
                isOpen={isDelProductModalOpen}
                setIsOpen={setIsDelProductModalOpen}
                tempProduct={tempProduct}
                getProducts={getProducts} />
        </>
    )
}

export default ProductsPage