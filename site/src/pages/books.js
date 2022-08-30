import React from 'react';
import { graphql, Link, useStaticQuery } from 'gatsby';
import slugify from 'slugify';

function BooksPage() {
  const data = useStaticQuery(graphql`
    query GetAllBooks {
      allBook {
        nodes {
          id
          name
          author {
            name
            slug
          }
          series
        }
      }
    }
  `);

  const books = data.allBook.nodes;

  return (
    <ul>
      {books.map((book) => {
        const bookSlug = slugify(book.name, { lower: true });

        let path;

        if (book.series) {
          const seriesSlug = slugify(book.series, { lower: true });
          path = `/book/${seriesSlug}/${bookSlug}`;
        } else {
          path = `/book/${bookSlug}`;
        }

        return (
          <li key={book.id}>
            <Link to={`${path}`}>{book.name}</Link>
          </li>
        );
      })}
    </ul>
  );
}

export default BooksPage;
