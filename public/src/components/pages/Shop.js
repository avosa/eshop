import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { limitTitle } from "../helpers/Helpers";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  getProducts,
  getProductByID,
  addToCart,
  filterByPrice,
  filterByCategory,
  filterByPriceCategory,
} from "../../actions/productActions";
import { FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";
import { inCart } from "../utils/utils";

const Product = ({
  product,
  index,
  products,
  getProductByID,
  addToCart,
  cartItems,
  page,
}) => {
  const addedToCart = inCart(product, cartItems);

  return (
    <div className="col-md-3">
      <div className="product">
        <div className="product-img" style={{ textAlign: "center" }}>
          <Link
            to={page ? "../" + product.slug : product.slug}
            onClick={() => {
              getProductByID(products, product.id);
            }}
          >
            <img
              src={JSON.parse(product.url)[0]}
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          </Link>
        </div>
        <div>
          <div className="product-description">
            <Link
              to={page ? "../" + product.slug : product.slug}
              onClick={() => {
                getProductByID(products, product.id);
              }}
            >
              <h3 className="title">{limitTitle(product.name)}</h3>
              <hr className="below-title"></hr>
              <span className="price">
                <span style={{ fontSize: "15px", fontWeight: "lighter" }}>
                  D
                </span>{" "}
                {new Intl.NumberFormat().format(product.sale_price)}{" "}
              </span>{" "}
              <sup className="orignal-price">
                <del>
                  {" "}
                  {new Intl.NumberFormat().format(product.regular_price)}{" "}
                </del>
              </sup>
            </Link>
            <hr className="below-price"></hr>
            <button
              className="add-to-cart"
              onClick={() => {
                let updatedProduct = { ...product, qty: 1 };
                addToCart(updatedProduct, cartItems);
              }}
              disabled={addedToCart}
            >
              {addedToCart ? "Added" : <FaShoppingCart />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Shop = (props) => {
  let page_no = props.match.params.page ? props.match.params.page : 1;

  const [page, setPage] = useState({ page: page_no });
  const [plusMinusPrice, setPlusMinusPrice] = useState({ plus: true });
  const [plusMinusCategories, setPlusMinusCategories] = useState({
    plus: true,
  });
  const [priceFilter, setPriceFilter] = useState([]);
  const [categories, setCategories] = useState({ categories: [] });
  const [categoryFilter, setCategoryFilter] = useState([]);

  const getCategories = async () => {
    let url = "";
    if (process.env.NODE_ENV === "development") {
      url =
        process.env.REACT_APP_DEVELOPMENT_API_URL +
        "/api/v1/product/categories";
    } else {
      url =
        process.env.REACT_APP_PRODUCTION_API_URL + "/api/v1/product/categories";
    }
    let response = await fetch(url);
    let data = await response.json();

    if (data) {
      setCategories({ ...categories, categories: [...data] });
    }
  };

  const next = () => {
    let currentPage = Number(page.page) + 1;
    setPage({ page: currentPage });
    props.history.push("/shop/" + currentPage);
  };

  const prev = () => {
    let currentPage = Number(page.page) - 1;
    if (currentPage === 0) {
      setPage({ page: 1 });
      props.history.push("/shop/" + currentPage);
    } else {
      setPage({ page: currentPage });
      props.history.push("/shop/" + currentPage);
    }
  };

  const changeToMinusPlusPrice = () => {
    if (plusMinusPrice.plus === true) {
      setPlusMinusPrice({ ...plusMinusPrice, plus: false });
    } else {
      setPlusMinusPrice({ ...plusMinusPrice, plus: true });
    }
  };

  const changeToMinusPlusCategories = () => {
    if (plusMinusCategories.plus === true) {
      setPlusMinusCategories({ ...plusMinusCategories, plus: false });
    } else {
      setPlusMinusCategories({ ...plusMinusCategories, plus: true });
    }
  };

  const filter = (event) => {
    setPriceFilter([event.target.value]);
  };

  const filterCategory = (event) => {
    setCategoryFilter([event.target.value]);
  };
  useEffect(() => {
    if (priceFilter.length > 0) {
      if (priceFilter.length > 0 && categoryFilter.length > 0) {
        if (page_no !== page.page) {
          props.filterByPriceCategory(page_no, priceFilter, categoryFilter);
        } else {
          props.filterByPriceCategory(page.page, priceFilter, categoryFilter);
        }
      } else {
        if (page_no !== page.page) {
          props.filterByPrice(page_no, priceFilter);
        } else {
          props.filterByPrice(page.page, priceFilter);
        }
      }
    } else if (categoryFilter.length > 0) {
      if (priceFilter.length > 0 && categoryFilter.length > 0) {
        if (page_no !== page.page) {
          props.filterByPriceCategory(page_no, priceFilter, categoryFilter);
        } else {
          props.filterByPriceCategory(page.page, priceFilter, categoryFilter);
        }
      } else {
        if (page_no !== page.page) {
          props.filterByCategory(page_no, categoryFilter);
        } else {
          props.filterByCategory(page.page, categoryFilter);
        }
      }
    } else {
      if (page_no !== page.page) {
        props.getProducts(page_no);
      } else {
        props.getProducts(page.page);
      }
    }
    getCategories();
  }, [priceFilter, categoryFilter, page, page_no]);

  return (
    <>
      {props.products !== undefined && page.page <= props.last_page ? (
        <div>
          <Helmet>
            <title>Shop | Mobicenter | Kenyas Number One Mobile Shop</title>
          </Helmet>
          <div className="breadcrumb">
            <div className="breadcrumb-container">
              <h2>Shop</h2>
            </div>
          </div>
          <div className="shop">
            <div className="shop-container">
              <div className="row">
                <div className="col-md-3 shop-left">
                  <ul>
                    <li className="filter-title">Price</li>
                    <li>
                      <a
                        type="button"
                        data-toggle="collapse"
                        data-target="#price"
                        onClick={changeToMinusPlusPrice}
                      >
                        {plusMinusPrice.plus === true ? (
                          <FaPlus />
                        ) : (
                          <FaMinus />
                        )}
                      </a>
                    </li>
                  </ul>
                  <div id="price" className="collapse">
                    <form>
                      <div className="custom-control custom-radio">
                        <input
                          type="radio"
                          className="custom-control-input"
                          id="customSwitch1"
                          onClick={filter}
                          value="0-2000"
                          name="radio-btn"
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="customSwitch1"
                        >
                          Under GMD2,000
                        </label>
                      </div>

                      <div className="custom-control custom-radio">
                        <input
                          type="radio"
                          className="custom-control-input"
                          id="customSwitch2"
                          value="2000-5000"
                          onClick={filter}
                          name="radio-btn"
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="customSwitch2"
                        >
                          GMD2,000 - GMD5,000
                        </label>
                      </div>

                      <div className="custom-control custom-radio">
                        <input
                          type="radio"
                          className="custom-control-input"
                          id="customSwitch3"
                          value="5000-10000"
                          onClick={filter}
                          name="radio-btn"
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="customSwitch3"
                        >
                          GMD5,000 - GMD10,000
                        </label>
                      </div>

                      <div className="custom-control custom-radio">
                        <input
                          type="radio"
                          className="custom-control-input"
                          id="customSwitch4"
                          value="10000-20000"
                          onClick={filter}
                          name="radio-btn"
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="customSwitch4"
                        >
                          GMD10,000 - GMD20,000
                        </label>
                      </div>

                      <div className="custom-control custom-radio">
                        <input
                          type="radio"
                          className="custom-control-input"
                          id="customSwitch5"
                          value="20000-40000"
                          onClick={filter}
                          name="radio-btn"
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="customSwitch5"
                        >
                          GMD20,000 - GMD40,000
                        </label>
                      </div>

                      <div className="custom-control custom-radio">
                        <input
                          type="radio"
                          className="custom-control-input"
                          id="customSwitch6"
                          value="40000"
                          onClick={filter}
                          name="radio-btn"
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="customSwitch6"
                        >
                          Above GMD40,000
                        </label>
                      </div>
                    </form>
                  </div>
                  <hr></hr>
                  <ul>
                    <li className="filter-title">Categories</li>
                    <li>
                      <a
                        type="button"
                        data-toggle="collapse"
                        data-target="#categories"
                        onClick={changeToMinusPlusCategories}
                      >
                        {plusMinusCategories.plus === true ? (
                          <FaPlus />
                        ) : (
                          <FaMinus />
                        )}
                      </a>
                    </li>
                  </ul>
                  <div id="categories" className="collapse">
                    <form>
                      {categories.categories.map((value, index) => {
                        return (
                          <>
                            <div className="custom-control custom-radio">
                              <input
                                type="radio"
                                className="custom-control-input"
                                id={"categorySwitch" + index}
                                value={value.id}
                                onClick={filterCategory}
                                name="radio-btn"
                              />
                              <label
                                className="custom-control-label"
                                htmlFor={"categorySwitch" + index}
                              >
                                {value.category_name}
                              </label>
                            </div>
                          </>
                        );
                      })}
                    </form>
                  </div>
                </div>
                <div className="col-md-9">
                  <div className="row shop-items">
                    {props.products.length > 0 ? (
                      props.products.map((product, index) => (
                        <Product
                          key={index}
                          index={index}
                          product={product}
                          products={props.products}
                          getProductByID={props.getProductByID}
                          addToCart={props.addToCart}
                          cartItems={props.cartItems}
                          page={page_no}
                        />
                      ))
                    ) : (
                      <h1>No Product Found</h1>
                    )}
                  </div>
                  {Number(props.last_page) >= 2 &&
                  Number(props.last_page) < 3 ? (
                    <>
                      <nav aria-label="Products Navigation">
                        <ul class="pagination justify-content-center">
                          <li
                            class={
                              "page-item " +
                              (Number(page.page) === 1 ? "disabled" : "")
                            }
                          >
                            <button class="page-link" onClick={prev}>
                              Previous
                            </button>
                          </li>
                          <li class="page-item">
                            <Link class="page-link" to="/shop/1">
                              1
                            </Link>
                          </li>
                          <li class="page-item">
                            <Link class="page-link" to="/shop/2">
                              2
                            </Link>
                          </li>
                          <li
                            class={
                              "page-item " +
                              (Number(page.page) === Number(props.last_page)
                                ? "disabled"
                                : "")
                            }
                          >
                            <button class="page-link" onClick={next}>
                              Next
                            </button>
                          </li>
                        </ul>
                      </nav>
                    </>
                  ) : (
                    ""
                  )}

                  {Number(props.last_page) >= 3 &&
                  Number(props.last_page) < 4 ? (
                    <>
                      <nav aria-label="Products Navigation">
                        <ul class="pagination justify-content-center">
                          <li
                            class={
                              "page-item " +
                              (Number(page.page) === 1 ? "disabled" : "")
                            }
                          >
                            <button class="page-link" onClick={prev}>
                              Previous
                            </button>
                          </li>
                          <li class="page-item">
                            <Link class="page-link" to="/shop/1">
                              1
                            </Link>
                          </li>
                          <li class="page-item">
                            <Link class="page-link" to="/shop/2">
                              2
                            </Link>
                          </li>
                          <li class="page-item">
                            <Link class="page-link" to="/shop/3">
                              3
                            </Link>
                          </li>
                          <li
                            class={
                              "page-item " +
                              (Number(page.page) === Number(props.last_page)
                                ? "disabled"
                                : "")
                            }
                          >
                            <button class="page-link" onClick={next}>
                              Next
                            </button>
                          </li>
                        </ul>
                      </nav>
                    </>
                  ) : (
                    ""
                  )}

                  {Number(props.last_page) > 4 ? (
                    <nav aria-label="Products Navigation">
                      <ul class="pagination justify-content-center">
                        <li
                          class={
                            "page-item " +
                            (Number(page.page) === 1 ? "disabled" : "")
                          }
                        >
                          <a
                            class="page-link"
                            href={"/shop/" + Number(page.page)}
                            onClick={prev}
                          >
                            Previous
                          </a>
                        </li>
                        <li class="page-item">
                          <a class="page-link" href="/store">
                            1
                          </a>
                        </li>
                        {Number(page.page) < 4 ? (
                          <>
                            <li class="page-item">
                              <a class="page-link" href="/shop/2">
                                2
                              </a>
                            </li>
                            <li class="page-item">
                              <a class="page-link" href="/shop/3">
                                3
                              </a>
                            </li>
                            <li class="page-item">
                              <a class="page-link" href="/shop/4">
                                4
                              </a>
                            </li>
                          </>
                        ) : (
                          <>
                            <li class="page-item">
                              <a class="page-link" href="#">
                                ...
                              </a>
                            </li>
                            <li class="page-item">
                              <a
                                class="page-link"
                                href={
                                  "/shop/" +
                                  (Number(props.last_page) -
                                    Number(page.page) <=
                                  3
                                    ? Number(props.last_page) - 2
                                    : Number(page.page))
                                }
                              >
                                {Number(props.last_page) - Number(page.page) <=
                                3
                                  ? Number(props.last_page) - 2
                                  : Number(page.page)}
                              </a>
                            </li>
                            <li class="page-item">
                              <a
                                class="page-link"
                                href={
                                  "/shop/" +
                                  (Number(props.last_page) -
                                    Number(page.page) -
                                    1 <=
                                  2
                                    ? Number(props.last_page) - 1
                                    : Number(page.page) + 1)
                                }
                              >
                                {Number(props.last_page) -
                                  Number(page.page) -
                                  1 <=
                                2
                                  ? Number(props.last_page) - 1
                                  : Number(page.page) + 1}
                              </a>
                            </li>
                            <li class="page-item">
                              <a
                                class="page-link"
                                href={
                                  "/shop/" +
                                  (Number(page.page) + 4 >=
                                  Number(props.last_page)
                                    ? Number(props.last_page)
                                    : Number(page.page) + 2)
                                }
                              >
                                {Number(page.page) + 4 > Number(props.last_page)
                                  ? Number(props.last_page)
                                  : Number(page.page) + 2}
                              </a>
                            </li>
                          </>
                        )}

                        {props.last_page > 4 &&
                        Number(props.last_page) - Number(page.page) > 4 ? (
                          <li class="page-item">
                            <a class="page-link" href="#">
                              ...
                            </a>
                          </li>
                        ) : (
                          ""
                        )}
                        {Number(props.last_page) - Number(page.page) > 3 ? (
                          <li class="page-item">
                            <a
                              class="page-link"
                              href={"/shop/" + Number(props.last_page)}
                            >
                              {" "}
                              {props.last_page}
                            </a>
                          </li>
                        ) : (
                          ""
                        )}
                        <li
                          class={
                            "page-item " +
                            (Number(page.page) === Number(props.last_page)
                              ? "disabled"
                              : "")
                          }
                        >
                          <a
                            class="page-link"
                            href={"/shop/" + Number(page.page)}
                            onClick={next}
                          >
                            Next
                          </a>
                        </li>
                      </ul>
                    </nav>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <Helmet>
            <title>Shop | Mobicenter | Kenyas Number One Mobile Shop</title>
          </Helmet>
          <div className="breadcrumb">
            <div className="breadcrumb-container">
              <h2>Shop</h2>
            </div>
          </div>
          <div className="shop">
            <div className="shop-container">
              <div className="row">
                <div className="col-md-3 shop-left">
                  <ul>
                    <li className="filter-title">Price</li>
                    <li>
                      <a
                        type="button"
                        data-toggle="collapse"
                        data-target="#price"
                      >
                        <i className="fa fa-plus"></i>
                      </a>
                    </li>
                  </ul>
                  <div id="price" className="collapse"></div>
                  <hr></hr>
                  <ul>
                    <li className="filter-title">Categories</li>
                    <li>
                      <a
                        type="button"
                        data-toggle="collapse"
                        data-target="#categories"
                      >
                        <i className="fa fa-plus"></i>
                      </a>
                    </li>
                  </ul>
                  <div id="categories" className="collapse"></div>
                </div>
                <div className="col-md-9 right-loading">
                  <div className="row">
                    <div className="col-md-3">
                      <div className="product-load">
                        <div className="product-loading"></div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="product-load">
                        <div className="product-loading"></div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="product-load">
                        <div className="product-loading"></div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="product-load">
                        <div className="product-loading"></div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="product-load">
                        <div className="product-loading"></div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="product-load">
                        <div className="product-loading"></div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="product-load">
                        <div className="product-loading"></div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="product-load">
                        <div className="product-loading"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  products: state.products.items.products,
  current_page: state.products.items.current_page,
  last_page: state.products.items.last_page,
  cartItems: state.products.cart ? state.products.cart : [],
});

export default connect(mapStateToProps, {
  getProducts,
  getProductByID,
  addToCart,
  filterByPrice,
  filterByCategory,
  filterByPriceCategory,
})(Shop);
