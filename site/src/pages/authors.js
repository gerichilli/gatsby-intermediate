import { graphql, Link, useStaticQuery } from 'gatsby';
import React from 'react';

function AuthorsPage() {
  const data = useStaticQuery(graphql`
    query GetAllAuthors {
      allAuthor {
        nodes {
          name
          slug
        }
      }
    }
  `);

  const authors = data.allAuthor.nodes;

  return (
    <ul>
      {authors.map((author) => (
        <li key={author.slug}>
          <Link to={`/${author.slug}`}>{author.name}</Link>
        </li>
      ))}
    </ul>
  );
}

export default AuthorsPage;
