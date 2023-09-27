import styles from './pagination.module.scss';
import usePagination from '../../hooks/usePagination';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { persist } from '../../utilities/persist';

const Pagination = ({
  limit,
  pageLimit,
  totalPage,
  setFirstCount,
}: {
  limit: number;
  pageLimit: number;
  totalPage: number;
  setFirstCount: Dispatch<SetStateAction<number>>;
}) => {
  const {
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
  } = usePagination({
    limit,
    pageLimit,
    totalPage,
  });

  useEffect(() => {
    if (persist.getSessionStorage('page')) {
      const saved = persist.getSessionStorage('page');
      setCurrentPage(saved.currentPage);
      setCurrentPageBlock(saved.currentPageBlock);
      setFirstCount(saved.firstCount);
    }
  }, []);

  return (
    <div className={styles.page}>
      <button
        onClick={() => {
          moveToFirst();
          setFirstCount(0);
        }}
        disabled={currentPage === 1 || currentPageBlock === 0}>
        &lt;&lt;
      </button>
      <button
        onClick={() => {
          prev();
          setFirstCount((currentPage - 1) * limit - limit);
        }}
        disabled={currentPage === 1 || totalPage === 1}>
        &lt;
      </button>
      {pageable.length > 1 &&
        pageable.map((i) => (
          <button
            key={i}
            data-index={currentPage === i ? i : null}
            onClick={() => {
              clickPage(i);
              setFirstCount((i - 1) * limit);
            }}>
            {i}
          </button>
        ))}
      <button
        onClick={() => {
          next();
          setFirstCount(currentPage * limit);
        }}
        disabled={currentPage === totalPage || totalPage <= 1}>
        &gt;
      </button>
      <button
        onClick={() => {
          moveToLast();
          setFirstCount(Math.ceil(totalPage / limit));
        }}
        disabled={currentPage === totalPage || Math.ceil(totalPage / pageLimit) <= 1}>
        &gt;&gt;
      </button>
    </div>
  );
};

export default Pagination;
