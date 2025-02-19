import axios from "axios";
import { useEffect, useRef } from "react";
import { Modal } from 'bootstrap';

const baseApi = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

function DelProductModal({ isOpen, setIsOpen, tempProduct, getProducts }) {
    const delproductModalRef = useRef(null);

    // 刪除密室
    const deleteProduct = async () => {
        try {
            await axios.delete(`${baseApi}/v2/api/${apiPath}/admin/product/${tempProduct.id}`);
        }
        catch (error) {
            console.error(error);
        }
    };


    // Modal - 刪除的確認按鈕監聽
    const handleDelProduct = async () => {
        await deleteProduct();
        getProducts();
        handleHideDelProductModal();
    };

    // 隱藏Modal - 刪除
    const handleHideDelProductModal = () => {
        const modalInstance = Modal.getInstance(delproductModalRef.current);
        modalInstance.hide();
        setIsOpen(false);
    };

    useEffect(() => {
        new Modal(delproductModalRef.current, {
            backdrop: false
        });
    }, []);

    useEffect(() => {
        if (isOpen) {
            const modalInstance = Modal.getInstance(delproductModalRef.current);
            modalInstance.show();
        }
    }, [isOpen]);

    return (
        <div
            ref={delproductModalRef}
            className="modal fade"
            id="delProductModal"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">刪除密室</h1>
                        <button
                            onClick={handleHideDelProductModal}
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        你是否要刪除
                        <span className="text-danger fw-bold"> {tempProduct.title}</span>
                    </div>
                    <div className="modal-footer">
                        <button
                            onClick={handleHideDelProductModal}
                            type="button"
                            className="btn btn-secondary"
                        >
                            取消
                        </button>
                        <button onClick={handleDelProduct} type="button" className="btn btn-danger">
                            刪除
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DelProductModal