import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategoryAsync } from "store/actions/CategoryAction";
import { getPostAsync } from "store/actions/PostAction";
import { RootState } from "store/reducers";
import { CategoryState } from "store/types/CategoryType";
import Main from "../components/Main";

const MainContainer = () => {
  const dispatch = useDispatch();
  const [category, setCategory] = useState<CategoryState[]>();
  const { data, getPostErr } = useSelector(
    (state: RootState) => state.GetPostReducer
  );
  const { getCategoryData, getCategoryErr } = useSelector(
    (state: RootState) => state.GetCategoryReducer
  );

  // setTimeout(() => {
  //   const { data } = useSelector((state: RootState) => state.GetPostReducer);
  //   console.log(data);
  // }, 3000);

  useEffect(() => {
    setCategory(getCategoryData?.res);
  }, [getCategoryData, getCategoryErr]);

  useEffect(() => {
    console.log(data);
  }, [data, getPostErr]);

  return <Main data={data} category={category} />;
};

export default MainContainer;
