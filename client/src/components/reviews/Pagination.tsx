import React, { useCallback, useMemo } from 'react';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';

type PaginationProps = { page: number; reviewsCount: number; unit: number };
// page가 바뀔 때  마다 리렌더링
/*
페이지 번호 누르면 url 변경 => searchParams dep 걸어논 useEffect 발동 => setPage => reviewTab 리렌더링 => page와 offset update => page가 변경되면서 자식컴포넌트인 Pagination 리렌더 => level 변경


*/

const Button = styled.button<{ isCurrent: boolean }>`
  ${({ isCurrent }) =>
    isCurrent &&
    css`
      color: var(--primaryOrange);
      font-weight: bold;
    `}
`;

function Pagination({ page, reviewsCount, unit }: PaginationProps) {
  let navigate = useNavigate();

  const pageLength = useMemo(() => {
    let length: number;
    if (reviewsCount === 0) {
      length = 0;
      return length;
    }
    if (reviewsCount && reviewsCount % unit === 0) {
      length = reviewsCount / unit;
    } else {
      length = Math.floor(reviewsCount / unit) + 1;
    }

    return length;
  }, [unit, reviewsCount]);

  const level = useMemo(() => {
    return page % 5 === 0 ? page / 5 : Math.floor(page / 5) + 1;
  }, [page]); //

  const paginationArr = useMemo(() => {
    const arr = [];
    for (let i = 0; i < pageLength - (level - 1) * unit; i++) {
      // i < 6 - (2 -1) * 5
      arr.push(i + 1 + unit * (level - 1)); // 6
    }
    return arr.slice(0, pageLength - 1);
  }, [level, pageLength, unit]);

  const routingPage = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const navTo = (event.target as HTMLElement).textContent;
      if (navTo === '<') {
        navigate(`.?page=${page - 1}`);
      } else if (navTo === '>') {
        navigate(`.?page=${page + 1}`);
      } else {
        navigate(`.?page=${navTo}`);
      }
    },
    [navigate, page]
  );

  return (
    <section className="pagination">
      <button disabled={page === 1} onClick={routingPage}>
        &lt;
      </button>

      {paginationArr.map((ele, idx) => {
        console.log(ele, idx);
        return (
          <Button
            isCurrent={ele === page ? true : false}
            onClick={routingPage}
            key={ele}
          >
            {ele}
          </Button>
        );
      })}
      <button disabled={page === pageLength} onClick={routingPage}>
        &gt;
      </button>
    </section>
  );
}

export default memo(Pagination);
