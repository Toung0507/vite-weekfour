import axios from "axios";
import { useRef, useState, useEffect } from "react";
import { Modal } from 'bootstrap';
import Swal from "sweetalert2";

const baseApi = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

function ProductModal({ isOpen, setIsOpen, modalMode, tempProduct, getProducts }) {
    const productModalRef = useRef(null);

    const [modalData, setModalData] = useState(tempProduct);

    // 新增密室
    const addProduct = async () => {
        try {
            const res = await axios.post(`${baseApi}/v2/api/${apiPath}/admin/product`, {
                data: {
                    ...modalData,
                    origin_price: Number(modalData.origin_price),
                    price: Number(modalData.price),
                    is_enabled: modalData.is_enabled ? 1 : 0
                }
            });
            return res;
        }
        catch (error) {
            Swal.fire({
                title: `新增失敗`,
                text: `${error.response.data.message}`,
                icon: "error"
            });
        }
    };

    // 更新密室
    const updateProduct = async () => {
        try {
            const res = await axios.put(`${baseApi}/v2/api/${apiPath}/admin/product/${modalData.id}`, {
                data: {
                    ...modalData,
                    time: Number(modalData.time),
                    origin_price: Number(modalData.origin_price),
                    price: Number(modalData.price),
                    is_enabled: modalData.is_enabled ? 1 : 0
                }
            });
            return res;
        }
        catch (error) {
            Swal.fire({
                title: `更新失敗`,
                text: `${error.response.data.message}`,
                icon: "error"
            });
            throw error;
        }
    };

    // Modal - 編輯及新增 的確認按鈕監聽
    const handleProduct = async () => {
        const apiCall = modalMode === 'create' ? addProduct : updateProduct;

        try {
            const res = await apiCall();
            if (res && res.data.success) {
                getProducts();
                handleHideProductModal();
            }
        } catch (error) {
            console.error(error);
        }
    };

    // 隱藏Modal - 編輯跟新增
    const handleHideProductModal = () => {
        const modalInstance = Modal.getInstance(productModalRef.current);
        modalInstance.hide();
        setIsOpen(false);
    };

    // 處理上傳圖片
    const handleInputFile = async (e) => {
        const imgFile = e.target.files[0];
        const formData = new FormData();
        formData.append('file-to-upload', imgFile);  // fieldName 要改成對應的名稱，這次的 API 是吃 file-to-upload

        try {
            const res = await axios.post(`${baseApi}/v2/api/${apiPath}/admin/upload`, formData);
            const imgFileUrl = res.data.imageUrl;
            setModalData({
                ...modalData,
                imageUrl: imgFileUrl
            })

        } catch (error) {
            console.error(error);
        }
    }

    // 處理密室Modal的input
    const handleModalInputChange = (e) => {
        const { value, name, checked, type } = e.target;

        setModalData({
            ...modalData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    // 處理副圖輸入 - 更新時的監聽
    const handleModalImagesInputChange = (e, index) => {
        const { value } = e.target;
        const newImages = [...modalData.imagesUrl];
        newImages[index] = value;

        setModalData({
            ...modalData,
            imagesUrl: newImages
        });
    };

    // 處理副圖輸入 - 新增圖片按鈕的狀態
    const handleAddImage = () => {
        const newImages = [...modalData.imagesUrl, ''];

        setModalData({
            ...modalData,
            imagesUrl: newImages
        });
    };

    // 處理副圖輸入 - 取消圖片按鈕的狀態
    const handleRemoveImage = () => {
        const newImages = [...modalData.imagesUrl];
        newImages.pop();

        setModalData({
            ...modalData,
            imagesUrl: newImages
        });
    };

    useEffect(() => {
        new Modal(productModalRef.current, {
            backdrop: false
        });
    }, []);

    useEffect(() => {
        if (isOpen) {
            const modalInstance = Modal.getInstance(productModalRef.current);
            modalInstance.show();
        }
    }, [isOpen]);

    useEffect(() => {
        setModalData({
            ...tempProduct
        })
    }, [tempProduct]);

    return (
        <div ref={productModalRef} id="productModal" className="modal" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered modal-xl">
                <div className="modal-content border-0 shadow">
                    <div className="modal-header border-bottom">
                        <h5 className="modal-title fs-4">{modalMode === 'edit' ? "編輯密室" : "新增密室"}</h5>
                        <button onClick={() => handleHideProductModal()} type="button" className="btn-close" aria-label="Close"></button>
                    </div>

                    <div className="modal-body p-4">
                        <div className="row g-4">
                            <div className="col-md-4">
                                <div className="mb-5">
                                    <label htmlFor="fileInput" className="form-label"> 圖片上傳 </label>
                                    <input
                                        onChange={handleInputFile}
                                        type="file"
                                        accept=".jpg,.jpeg,.png"
                                        className="form-control"
                                        id="fileInput"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="primary-image" className="form-label">
                                        主視圖
                                    </label>
                                    <div className="input-group">
                                        <input
                                            value={modalData.imageUrl}
                                            onChange={handleModalInputChange}
                                            name="imageUrl"
                                            type="text"
                                            id="primary-image"
                                            className="form-control"
                                            placeholder="請輸入圖片連結"
                                        />
                                    </div>
                                    <img
                                        src={modalData.imageUrl ? modalData.imageUrl : null}
                                        alt={modalData.title}
                                        className="img-fluid"
                                    />
                                </div>

                                {/* 副圖 */}
                                <div className="border border-2 border-dashed rounded-3 p-3">
                                    {modalData.imagesUrl?.map((image, index) => (
                                        <div key={index} className="mb-2">
                                            <label
                                                htmlFor={`imagesUrl-${index + 1}`}
                                                className="form-label"
                                            >
                                                宣傳圖 {index + 1}
                                            </label>
                                            <input
                                                value={image}
                                                onChange={(e) => handleModalImagesInputChange(e, index)}
                                                id={`imagesUrl-${index + 1}`}
                                                type="text"
                                                placeholder={`圖片網址 ${index + 1}`}
                                                className="form-control mb-2"
                                            />
                                            {image && (
                                                <img
                                                    src={image}
                                                    alt={`副圖 ${index + 1}`}
                                                    className="img-fluid mb-2"
                                                />
                                            )}
                                        </div>
                                    ))}
                                    <div className="btn-group w-100">
                                        {modalData.imagesUrl.length < 5 &&
                                            modalData.imagesUrl[modalData.imagesUrl.length - 1] !== '' &&
                                            <button onClick={handleAddImage} className="btn btn-outline-primary btn-sm w-100">新增圖片</button>
                                        }
                                        {
                                            modalData.imagesUrl.length > 1 &&
                                            <button onClick={handleRemoveImage} className="btn btn-outline-danger btn-sm w-100">取消圖片</button>
                                        }

                                    </div>
                                </div>
                            </div>

                            <div className="col-md-8">
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">
                                        密室名稱
                                    </label>
                                    <input
                                        value={modalData.title}
                                        onChange={handleModalInputChange}
                                        name="title"
                                        id="title"
                                        type="text"
                                        className="form-control"
                                        placeholder="請輸入密室名稱"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="category" className="form-label">
                                        分類
                                    </label>
                                    <input
                                        value={modalData.category}
                                        onChange={handleModalInputChange}
                                        name="category"
                                        id="category"
                                        type="text"
                                        className="form-control"
                                        placeholder="請輸入分類"
                                    />
                                </div>

                                <div className="row g-3 mb-3">
                                    <div className="col-6">
                                        <label htmlFor="unit" className="form-label">
                                            單位
                                        </label>
                                        <input
                                            value={modalData.unit}
                                            onChange={handleModalInputChange}
                                            name="unit"
                                            id="unit"
                                            type="text"
                                            className="form-control"
                                            placeholder="請輸入單位"
                                        />
                                    </div>
                                    <div className="col-6">
                                        <label htmlFor="time" className="form-label">
                                            遊玩時間(總分鐘數)
                                        </label>
                                        <input
                                            value={modalData.time}
                                            onChange={handleModalInputChange}
                                            name="time"
                                            id="time"
                                            type="number"
                                            className="form-control"
                                            placeholder="請輸入遊玩時間(總分鐘數)"
                                            min={0}
                                        />
                                    </div>
                                </div>

                                <div className="row g-3 mb-3">
                                    <div className="col-6">
                                        <label htmlFor="origin_price" className="form-label">
                                            定價
                                        </label>
                                        <input
                                            value={modalData.origin_price}
                                            onChange={handleModalInputChange}
                                            name="origin_price"
                                            id="origin_price"
                                            type="number"
                                            className="form-control"
                                            placeholder="請輸入定價"
                                            min={0}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <label htmlFor="price" className="form-label">
                                            售價
                                        </label>
                                        <input
                                            value={modalData.price}
                                            onChange={handleModalInputChange}
                                            name="price"
                                            id="price"
                                            type="number"
                                            className="form-control"
                                            placeholder="請輸入售價"
                                            min={0}
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">
                                        密室描述
                                    </label>
                                    <textarea
                                        value={modalData.description}
                                        onChange={handleModalInputChange}
                                        name="description"
                                        id="description"
                                        className="form-control"
                                        rows={4}
                                        placeholder="請輸入密室描述"
                                    ></textarea>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="content" className="form-label">
                                        密室官方網址
                                    </label>
                                    <input
                                        value={modalData.content}
                                        onChange={handleModalInputChange}
                                        name="content"
                                        id="content"
                                        className="form-control"
                                        rows={4}
                                        placeholder="請輸入密室官方網址"
                                    ></input>
                                </div>

                                <div className="form-check">
                                    <input
                                        checked={modalData.is_enabled}
                                        onChange={handleModalInputChange}
                                        name="is_enabled"
                                        type="checkbox"
                                        className="form-check-input"
                                        id="isEnabled"
                                    />
                                    <label className="form-check-label" htmlFor="isEnabled">
                                        是否啟用
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer border-top bg-light">
                        <button type="button" className="btn btn-secondary" onClick={() => handleHideProductModal()}>
                            取消
                        </button>
                        <button type="button" className="btn btn-primary" onClick={() => handleProduct()}>
                            確認
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductModal