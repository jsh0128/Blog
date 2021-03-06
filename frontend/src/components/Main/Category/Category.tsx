import { CategoryState } from "store/types/CategoryType";
import styled from "styled-components";
import Update from "util/enums/Update";
import {
  CustomBtn,
  CustomInput,
  ModalBackground,
} from "components/common/Basic/Basic";
import { RiDeleteBin2Line } from "react-icons/ri";
import { BsPencilSquare } from "react-icons/bs";

interface CategoryProps {
  category: CategoryState[] | null;
  selectedCategory: string;
  onClickCategoryPost: (idx: number, category: string) => void;
  onClickSelectedAll: () => void;
  is_admin: boolean;
  updateCategory: (
    type: Update,
    category?: string,
    changeName?: string
  ) => void;
  categoryModal: boolean;
  setCategoryModal: React.Dispatch<React.SetStateAction<boolean>>;
  setCreateCategory: React.Dispatch<React.SetStateAction<string>>;
  update: string;
  setUpdate: React.Dispatch<React.SetStateAction<string>>;
  setChangeName: React.Dispatch<React.SetStateAction<string>>;
}

const Category = ({
  selectedCategory,
  onClickSelectedAll,
  category,
  onClickCategoryPost,
  is_admin,
  updateCategory,
  categoryModal,
  setCategoryModal,
  setCreateCategory,
  update,
  setUpdate,
  setChangeName,
}: CategoryProps) => {
  return (
    <>
      <CategoriesStyle is_admin={is_admin}>
        <CategoryArea>
          {selectedCategory === "" ? (
            <SelectedCategory
              onClick={() => {
                onClickSelectedAll();
              }}
            >
              <CategoryItemSpan>전체보기</CategoryItemSpan>
            </SelectedCategory>
          ) : (
            <CategoryItem
              onClick={() => {
                onClickSelectedAll();
              }}
            >
              <CategoryItemSpan>전체보기</CategoryItemSpan>
            </CategoryItem>
          )}
          {category &&
            category?.map((item, key) => (
              <div key={key}>
                {item.category === selectedCategory ? (
                  <SelectedCategory>
                    <CategoryItemSpan>{item.category}</CategoryItemSpan>
                  </SelectedCategory>
                ) : (
                  <CategoryItem
                    onClick={() => onClickCategoryPost(item.idx, item.category)}
                  >
                    <CategoryItemSpan>{item.category}</CategoryItemSpan>
                  </CategoryItem>
                )}
              </div>
            ))}
        </CategoryArea>
        {is_admin && (
          <UpdateBtn>
            <CustomSpan
              onClick={() => {
                setUpdate(Update.CREATE);
                setCategoryModal(true);
              }}
            >
              +
            </CustomSpan>
            {category &&
              category?.map((item, key) => (
                <Buttons key={key}>
                  <RiDeleteBin2Line
                    onClick={() => {
                      updateCategory(Update.DELETE, item.category);
                    }}
                  />
                  <BsPencilSquare
                    onClick={() => {
                      setCategoryModal(true);
                      setUpdate(Update.MODIFY);
                      setChangeName(item.category);
                    }}
                    style={{ marginLeft: "0.2rem" }}
                  />
                </Buttons>
              ))}
          </UpdateBtn>
        )}
      </CategoriesStyle>
      {categoryModal && (
        <>
          <CreateCategoryArea>
            <CustomInput
              onChange={(e) => setCreateCategory(e.target.value)}
              placeholder="카테고리"
            />
            {update === Update.CREATE && (
              <CustomBtn onClick={() => updateCategory(Update.CREATE)}>
                만들기
              </CustomBtn>
            )}
            {update === Update.MODIFY && (
              <CustomBtn onClick={() => updateCategory(Update.MODIFY)}>
                수정하기
              </CustomBtn>
            )}
          </CreateCategoryArea>
          <ModalBackground onClick={() => setCategoryModal(false)} />
        </>
      )}
    </>
  );
};
export default Category;

const CategoryArea = styled.div`
  ${({ theme }) => theme.device?.tablet} {
    width: 100%;
    display: flex;
    overflow-x: scroll;
  }
`;

const CategoryItemSpan = styled.span`
  margin: 0 0.5rem;
  white-space: nowrap;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CreateCategoryArea = styled.div`
  display: flex;
  position: fixed;
  flex-direction: column;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 101;
  align-items: center;
  justify-content: center;
`;

const CategoriesStyle = styled.div<{ is_admin: boolean }>`
  display: flex;
  align-content: flex-end;
  border-right: ${(props) => !props.is_admin && "1px solid black"};
  padding-right: 3rem;
  ${({ theme }) => theme.device?.mobile} {
    width: 80%;
  }
  ${({ theme }) => theme.device?.tablet} {
    display: flex;
    border: none;
    width: 100%;
    padding: 0;
  }
  ${({ theme }) => theme.device?.desktop} {
    flex-direction: row;
    width: 100%;
    padding: 0;
    border: none;
  }
`;

const UpdateBtn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 3rem;
  justify-content: space-between;
  cursor: pointer;
  ${({ theme }) => theme.device?.desktop} {
    display: none;
  }
`;

const CustomSpan = styled.span`
  cursor: pointer;
`;

const CategoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.3rem;
  cursor: pointer;
`;

const SelectedCategory = styled(CategoryItem)`
  font-weight: bold;
  font-size: 1.1rem;
`;
