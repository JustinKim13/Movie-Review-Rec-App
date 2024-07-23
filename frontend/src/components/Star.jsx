import React from 'react';

const Star = ({ filled, onMouseEnter, onMouseLeave, onClick }) => {
  return (
    <svg
      width='1em'
      height='1em'
      viewBox='0 0 16 16'
      className='bi bi-star'
      fill={filled ? 'yellow' : 'gray'}
      xmlns='http://www.w3.org/2000/svg'
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <path
        d='M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73-3.522-3.356c-.329-.314-.158-.888.283-.95l4.898-.696L8 1.12l2.045 4.593 4.898.696c.441.062.612.636.283.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z'
      />
    </svg>
  );
};

export default Star;
