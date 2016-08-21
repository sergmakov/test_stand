import React from 'react';
import ReactDOM from 'react-dom';
import Blog from './blog.js';

ReactDOM.render(
	<Blog localStorageKey="blog"/>,
	document.getElementById('content')
);
