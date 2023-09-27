import { useState } from 'react';
import { persist } from '../utilities/persist';

const usePagination = ({ limit, pageLimit, totalPage }: { limit: number; pageLimit: number; totalPage: number }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageBlock, setCurrentPageBlock] = useState(0);

  const pageOffset = currentPageBlock * pageLimit;

  const handlePageBlock = (totalPage: number) => {
    const pageArr: number[] = [];
    for (let i = 0; i < totalPage; i++) pageArr.push(i + 1);
    return pageArr;
  };

  let pageable = handlePageBlock(totalPage).slice(pageOffset, pageOffset + pageLimit);

  const clickPage = (i: number) => {
    setCurrentPage(i);
    persist.setSessionStorage('page', {
      currentPage: i,
      currentPageBlock: currentPageBlock,
      firstCount: (i - 1) * limit,
    });
  };

  const prev = () => {
    if (currentPage <= 1) return;
    if (currentPage - 1 <= pageLimit * currentPageBlock) setCurrentPageBlock((prev) => prev - 1);
    setCurrentPage((page) => page - 1);
    persist.setSessionStorage('page', {
      currentPage: currentPage - 1,
      currentPageBlock: currentPageBlock,
      firstCount: (currentPage - 1) * limit - limit,
    });
  };

  const next = () => {
    if (currentPage >= totalPage) return;
    if (pageLimit * (currentPageBlock + 1) < currentPage + 1) setCurrentPageBlock((prev) => prev + 1);
    setCurrentPage((page) => page + 1);
    persist.setSessionStorage('page', {
      currentPage: currentPage + 1,
      currentPageBlock: currentPageBlock,
      firstCount: currentPage * limit,
    });
  };

  const moveToFirst = () => {
    setCurrentPage(1);
    setCurrentPageBlock(0);
  };

  const moveToLast = () => {
    setCurrentPage(totalPage);
    setCurrentPageBlock(Math.ceil(totalPage / pageLimit) - 1);
  };

  return {
    currentPage,
    setCurrentPage,
    currentPageBlock,
    setCurrentPageBlock,
    pageable,
    clickPage,
    prev,
    next,
    moveToFirst,
    moveToLast,
  };
};

export default usePagination;
