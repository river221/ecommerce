import { Dispatch, SetStateAction, useEffect } from 'react';
import styles from './pagination.module.scss';

const Pagination = ({
  limit,
  totalPage,
  currentPage,
  setCurrentPage,
  currentPageBlock,
  setCurrentPageBlock,
  firstCount,
  setFirstCount,
}: {
  limit: number;
  totalPage: number;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  currentPageBlock: number;
  setCurrentPageBlock: Dispatch<SetStateAction<number>>;
  firstCount: number;
  setFirstCount: Dispatch<SetStateAction<number>>;
}) => {
  let pageLimit = 5;
  const pageOffset = currentPageBlock * pageLimit;

  const handlePageBlock = (totalPage: number) => {
    const pageArr: number[] = [];
    for (let i = 0; i < totalPage; i++) pageArr.push(i + 1);
    return pageArr;
  };

  let pageable = handlePageBlock(totalPage).slice(pageOffset, pageOffset + pageLimit);

  const savedPage = sessionStorage.getItem('page');

  const savePage = (currentPage: number, currentPageBlock: number, firstCount: number) => {
    sessionStorage.setItem(
      'page',
      JSON.stringify({
        currentPage,
        currentPageBlock,
        firstCount,
      })
    );
  };

  const prev = () => {
    if (currentPage <= 1) return;
    if (currentPage - 1 <= pageLimit * currentPageBlock) setCurrentPageBlock((prev) => prev - 1);
    setCurrentPage((page) => page - 1);
    setFirstCount((currentPage - 1) * limit - limit);
    savePage(currentPage - 1, currentPageBlock, (currentPage - 1) * limit - limit);
  };

  const next = () => {
    if (currentPage >= totalPage) return;
    if (pageLimit * (currentPageBlock + 1) < currentPage + 1) setCurrentPageBlock((prev) => prev + 1);
    setCurrentPage((page) => page + 1);
    setFirstCount(currentPage * limit);
    savePage(currentPage + 1, currentPageBlock, currentPage * limit);
  };

  useEffect(() => {
    if (savedPage) {
      const saved = JSON.parse(savedPage);
      setCurrentPage(saved.currentPage);
      setCurrentPageBlock(saved.currentPageBlock);
      setFirstCount(saved.firstCount);
    }
  }, []);

  return (
    <div className={styles.page}>
      <button
        onClick={() => {
          setCurrentPage(1);
          setCurrentPageBlock(0);
          setFirstCount(0);
        }}
        disabled={currentPage === 1 || currentPageBlock === 0}>
        &lt;&lt;
      </button>
      <button onClick={() => prev()} disabled={currentPage === 1 || totalPage === 1}>
        &lt;
      </button>
      {pageable.length > 1 &&
        pageable.map((i) => (
          <button
            key={i}
            data-index={currentPage === i ? i : null}
            onClick={() => {
              setCurrentPage(i);
              setFirstCount((i - 1) * limit);
              savePage(i, currentPageBlock, (i - 1) * limit);
            }}>
            {i}
          </button>
        ))}
      <button onClick={() => next()} disabled={currentPage === totalPage || totalPage <= 1}>
        &gt;
      </button>
      <button
        onClick={() => {
          setCurrentPage(totalPage);
          setCurrentPageBlock(Math.ceil(totalPage / pageLimit) - 1);
          setFirstCount(Math.ceil(totalPage / limit));
        }}
        disabled={currentPage === totalPage || Math.ceil(totalPage / pageLimit) <= 1}>
        &gt;&gt;
      </button>
    </div>
  );
};

export default Pagination;
