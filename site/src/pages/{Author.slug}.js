import React from 'react';
import { graphql, Link } from 'gatsby';
import slugify from 'slugify';

function AuthorPage({ data }) {
  const { author } = data;
  const books = sortAndExtendBooks(author.books);
  return (
    <div>
      <h1>{author.name}</h1>
      <pre>{JSON.stringify(books, null, 2)}</pre>
      <p>Books by {author.name}:</p>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <Link to={book.path}>{book.displayName}</Link>
          </li>
        ))}
      </ul>
      <Link to="/authors">Back to all authors</Link>
    </div>
  );
}

function sortAndExtendBooks(books) {
  return books
    .sort((a, b) => a.seriesOrder - b.seriesOrder)
    .map((book) => {
      const series = book.series
        ? `(${book.series}, book ${book.seriesOrder})`
        : '';
      const displayName = `${book.name} ${series}`;
      const bookSlug = slugify(book.name, { lower: true });
      let path;

      if (book.series !== null) {
        const seriesSlug = slugify(book.series, { lower: true });
        path = `/book/${seriesSlug}/${bookSlug}`;
      } else {
        path = `/book/${bookSlug}`;
      }

      return { ...book, displayName, path };
    });
}

export default AuthorPage;

export const query = graphql`
  query AuthorPage($id: String!) {
    author(id: { eq: $id }) {
      name
      books {
        id
        name
        series
        seriesOrder
      }
    }
  }
`;
