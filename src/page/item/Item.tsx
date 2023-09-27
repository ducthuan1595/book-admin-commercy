import React, { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import MainLayout from "../../layout/MainLayout";
import AddItem from "./AddItem";
import { requests } from "../../api";
import { context } from "../../store";
import { URL } from "../../api";
import handleToast from "../../util/toast";
import { CategoryType } from "../category/Category";
import { FlashSaleType } from "../flashSale/FlashSale";

export interface ItemType {
  _id: string;
  name: string;
  author: string;
  pic: string[];
  description: string;
  pricePay: number;
  priceInput: number;
  slogan: string;
  barcode: string;
  count: number;
  weight: number;
  flashSaleId: FlashSaleType;
  categoryId: CategoryType;
  detailPic: string[];
}

interface ItemStateType {
  currPage: number;
  nextPage: boolean;
  prevPage: boolean;
  totalItem: number;
  totalPage: number;
  totalNumber: number;
  products: ItemType[];
}

export default function Item() {
  const value = useContext(context);

  const [item, setItem] = useState<ItemStateType | null>(null);
  const [detailItem, setDetailItem] = useState<ItemType | null>(null);

  const getItem = async (page: number | null) => {
    if (value && value.user && value.user.token) {
      const limit: number = 8;
      const res = await requests.getItem(
        null,
        null,
        null,
        page,
        limit,
        null,
        value.user.token
      );

      console.log(res.data);

      if (res.data.message === "ok") {
        setItem(res.data.data);
        value.setTotalProduct(res.data.data.totalNumber);
      }
    }
  };
  useEffect(() => {
    getItem(1);
  }, []);

  const handleDelete = async (id: string) => {
    if (value && value.user && value.user.token) {
      const object = {
        itemId: id,
      };
      const res = await requests.deleteItem(object, value.user.token);
      if (res.data.message === "ok") {
        handleToast(toast.success, "You removed successfully");
        getItem(1);
      } else {
        handleToast(toast.error, res.data.message);
      }
    }
  };

  const handleEdit = async (id: string) => {
    if (value && value.user && value.user.token) {
      const res = await requests.getItem(
        null,
        null,
        null,
        null,
        null,
        id,
        value.user.token
      );
      console.log("detail item", res);

      if (res.data.message === "ok") {
        setDetailItem(res.data.data);
        window.scrollTo(0, 0);
      }
    }
  };

  const handleNextPage = () => {
    if (item && item.currPage && item.nextPage) {
      console.log(item.currPage);

      const page = +item.currPage + 1;
      getItem(page);
    }
  };
  const handlePrevPage = () => {
    if (item && item.currPage && item.prevPage) {
      const page = +item.currPage - 1;
      getItem(page);
    }
  };

  return (
    <MainLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-[white] text-[32px] pb-4">Manager Product</h1>
          <span className="text-[white] bg-[#383838] text-center rounded-xl ml-3 h-[40px] px-2 hover:opacity-80 leading-[2.4]"></span>
        </div>
        <AddItem getItem={getItem} detailItem={detailItem} />
        <div className="text-[white] mt-12 text-[22px] text-center">
          List Product
        </div>
        <table className="text-[#333] mt-4">
          <thead>
            <tr>
              <th>Book Name</th>
              <th>Author</th>
              <th>Image</th>
              <th>Price Origin</th>
              <th>Price Pay</th>
              <th>Barcode</th>
              <th>Category</th>
              <th>Count</th>
              <th>Page Number</th>
              <th>Flash Sale</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {item &&
              item.products &&
              item.products.map((c) => {
                return (
                  <tr key={c._id}>
                    <td className="capitalize">{c.name}</td>
                    <td className="capitalize">{c.author}</td>
                    <td className="flex flex-wrap gap-1">
                      {c.pic.map((i) => {
                        return (
                          <span className="" key={i}>
                            <img
                              className="h-12"
                              src={`${URL}/image/${i}`}
                              alt="book"
                            />
                          </span>
                        );
                      })}
                    </td>
                    <td>
                      {c.priceInput
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                      đ
                    </td>
                    <td>
                      {c.pricePay
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                      đ
                    </td>
                    <td>{c.barcode}</td>
                    <td>{c.categoryId.name}</td>
                    <td>{c.count} books</td>
                    <td>{c.weight} pages</td>
                    <td>{c.flashSaleId ? c.flashSaleId.name : "no"}</td>

                    <td className="text-center cursor-pointer w-[5rem]">
                      <button className="mr-5">
                        <i
                          onClick={() => handleEdit(c._id)}
                          className="fa-solid fa-pencil text-[green] text-[19px]"
                        ></i>
                      </button>
                      <button>
                        <i
                          onClick={handleDelete.bind(null, c._id)}
                          className="fa-solid fa-trash text-[#f00] text-[19px]"
                        ></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        {item?.totalPage && item.totalPage > 1 && (
          <div className="text-[white] flex gap-4 mt-4 mb-8 justify-between items-center">
            {item?.prevPage ? (
              <span
                className="cursor-pointer border-[1px] py-2 rounded-lg border-[#383838] w-[45%] justify-self-start"
                onClick={handlePrevPage}
              >
                <div className="pl-[20px]">
                  <i className="fa-solid fa-chevron-left"></i> Prev
                </div>
              </span>
            ) : (
              <span className="w-[45%]"></span>
            )}
            <span>{item.currPage}</span>
            {item?.nextPage ? (
              <span
                className="cursor-pointer border-[1px] py-2 rounded-lg border-[#383838] w-[45%] text-right justify-items-end"
                onClick={handleNextPage}
              >
                <div className="pr-[20px]">
                  Next <i className="fa-solid fa-chevron-right"></i>
                </div>
              </span>
            ) : (
              <span className="w-[45%]"></span>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
