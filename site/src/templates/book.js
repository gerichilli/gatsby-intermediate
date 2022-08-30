import React from 'react';
import { graphql, Link } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import { listing, heading } from '../styles/book.module.css';

function BookPage({ data }) {
  const book = data.book;
  return (
    <>
      <div className={listing}>
        <GatsbyImage image={getImage(book.cover)} alt={book.name} />
        <div>
          <h1 className={heading}>{book.name}</h1>
          <p>
            Author <Link to={`/${book.author.slug}`}>{book.author.name}</Link>
          </p>
          <p>
            {book.series && (
              <p>
                This is book {book.seriesOrder} of the {book.series}.
              </p>
            )}
          </p>
        </div>
      </div>
      <Link to="/books">Back to all books</Link>
      <pre>{JSON.stringify(book, null, 2)}</pre>
    </>
  );
}

export default BookPage;

export const query = graphql`
  query BookPage($id: String!) {
    book(id: { eq: $id }) {
      name
      author {
        name
        slug
      }
      series
      seriesOrder
      buyLink
      cover {
        childImageSharp {
          gatsbyImageData(width: 150)
        }
      }
    }
  }
`;
