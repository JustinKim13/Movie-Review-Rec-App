import React from 'react';

const SearchBox = (props) => {
	return (
		<div className='search-container'>
			<input
				className='search-box form-control'
				value={props.value}
				onChange={(event) => props.setSearchValue(event.target.value)}
				placeholder='Type to search...'
			></input>
		</div>
	);
};

export default SearchBox;
