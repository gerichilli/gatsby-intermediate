import React, { useEffect } from 'react';
import { navigate } from 'gatsby';

import { form, input, button } from '../../styles/search.module.css';

export default function SearchClientOnly({ params }) {
  const query = decodeURIComponent(params['*']);
  const [currentQuery, setCurrentQuery] = React.useState(query);
  const [result, setResult] = React.useState(null);
  const [status, setStatus] = React.useState('IDLE');

  function handleSearch(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const query = form.get('query');

    setCurrentQuery(query);
    navigate(`/search/${encodeURIComponent(query)}`);
  }

  function handleSearchReset() {
    setCurrentQuery('');
    navigate('/search');
  }

  async function bookSearch(query) {
    setStatus('LOADING');
    const res = await fetch(`https://openlibrary.org/search.json?q=${query}`);
    if (!res.ok) {
      throw new Error(`Search failed: ${res.status}`);
    }

    const result = await res.json();
    setResult(result);
    setStatus('IDLE');
  }

  useEffect(() => {
    if (currentQuery === '') {
      setResult(null);
      return;
    }

    bookSearch(currentQuery);
  }, [currentQuery]);
  return (
    <>
      <h1>Search for a book</h1>
      <form className={form} onSubmit={handleSearch}>
        <input type="search" name="query" className={input} />
        <button type="submit" className={button}>
          Search
        </button>
        <button type="reset" className={button} onClick={handleSearchReset}>
          Reset
        </button>
      </form>
      {status === 'LOADING' && <p>Loading...</p>}
      {status === 'IDLE' && currentQuery !== '' && (
        <>
          <h2>Results for {currentQuery}</h2>
          <ul>
            {result &&
              result.docs.map((doc) => (
                <li key={doc.key}>
                  <h3>{doc.title}</h3>
                  <p>{doc.author_name && `by ${doc.author_name}`}</p>
                </li>
              ))}
          </ul>
        </>
      )}
    </>
  );
}
