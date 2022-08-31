const fetch = require('node-fetch');
const { createRemoteFileNode } = require('gatsby-source-filesystem');
const authors = require('./src/data/authors.json');
const books = require('./src/data/books.json');
const slugify = require('slugify');

exports.sourceNodes = ({ actions, createNodeId, createContentDigest }) => {
  const { createNode, createTypes } = actions;

  // createTypes: https://www.gatsbyjs.com/docs/reference/config-files/actions/#createTypes
  // Create relation of 2 nodes
  // [Book!]! - array of books, or empty array, but never null
  // @link, from, by: https://www.gatsbyjs.com/docs/reference/graphql-data-layer/schema-customization/#foreign-key-fields
  // @link: connect to a different Node
  // by:foreign-key - define which field to use on the source node
  // from: optional - getting the field on the current type which acts as the foreign-key to the field specified in by
  // type Book
  // When I'm in the book type, I want to access the author information
  // Use the value from book.author, match it by the field author.slug
  // type Author
  // When I'm in the author, I want to access all the books that are written by this author
  // Use the value from author.slug and match it by the field book.author.slug

  createTypes(`
    type Book implements Node {
      author: Author! @link(by: "slug" from: "author")
    }

    type Author implements Node {
      books: [Book!]! @link(by: "author.slug" from: "slug")
    }    
  `);

  // CreateNode: https://www.gatsbyjs.com/docs/reference/config-files/actions/#createNode
  authors.forEach((author) => {
    createNode({
      ...author,
      id: createNodeId(`author-${author.slug}`),
      parent: null, // The ID of the parent’s node
      children: [], // An array of children node IDs
      internal: {
        type: 'Author', // used in forming GraphQL types
        content: JSON.stringify(author), // used when a source plugin sources data it doesn’t know how to transform
        contentDigest: createContentDigest(author), // digest for the content of this node => Helps Gatsby avoid doing extra work on data that hasn’t changed
      },
    });
  });

  books.forEach((book) => {
    createNode({
      ...book,
      id: createNodeId(`book-${book.isbn}`),
      parent: null, // top level node, have no parent
      children: [],
      internal: {
        type: 'Book',
        content: JSON.stringify(book),
        contentDigest: createContentDigest(book),
      },
    });
  });
};

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;

  // createPage: https://www.gatsbyjs.com/docs/reference/config-files/actions/#createPage
  // createPage(pageObject, plugin, actionOptions)
  createPage({
    path: '/custom', // Any valid URL. Must start with a forward slash (/)
    component: require.resolve(`${__dirname}/src/templates/custom.js`), // absolute path to the component for this page
    context: {
      // data for page, passed as props to the component this.props.pageContext
      title: 'Gatsby Site',
      meta: {
        description: 'Gatsby Site Description',
      },
    },
  });

  const result = await graphql(`
    query GetBooks {
      allBook {
        nodes {
          id
          series
          name
        }
      }
    }
  `);

  const allBooks = result.data.allBook.nodes;

  allBooks.forEach((book) => {
    const bookSlug = slugify(book.name, { lower: true });

    if (!book.series) {
      createPage({
        path: `/book/${bookSlug}`,
        component: require.resolve(`${__dirname}/src/templates/book.js`),
        context: {
          id: book.id,
        },
      });
    } else {
      const seriesSlug = slugify(book.series, { lower: true });
      createPage({
        path: `/book/${seriesSlug}/${bookSlug}`,
        component: require.resolve(`${__dirname}/src/templates/book.js`),
        context: {
          id: book.id,
        },
      });
    }
  });
};

// createResolvers API: https://www.gatsbyjs.com/docs/reference/graphql-data-layer/schema-customization/#createresolvers-api
exports.createResolvers = ({
  actions,
  cache,
  createNodeId,
  createResolvers,
  store,
  reporter,
}) => {
  const { createNode } = actions;
  const resolvers = {
    Book: {
      buyLink: {
        type: 'String',
        resolve: (source) =>
          `https://www.powells.com/searchresults?keyword=${source.isbn}`,
      },
      cover: {
        type: 'File',
        resolve: async (source) => {
          const response = await fetch(
            `https://openlibrary.org/isbn/${source.isbn}.json`,
          );

          if (!response.ok) {
            reporter.warn(
              `Error loading cover image - got ${response.statusText}`,
            );
            return null;
          }

          const { covers } = await response.json();

          if (covers.length > 0) {
            // https://www.gatsbyjs.com/plugins/gatsby-source-filesystem/#createremotefilenode
            // makes it easy to download remote files and add them to site’s GraphQL schema
            return createRemoteFileNode({
              url: `https://covers.openlibrary.org/b/id/${covers[0]}-L.jpg`, // The source url of the remote file
              store, // The id of the parent node
              cache, // Gatsby's cache which the helper uses to check if the file has been downloaded already
              createNode, // The action used to create nodes
              createNodeId, // A helper function for creating node Ids
              reporter,
            });
          } else {
            return null;
          }
        },
      },
    },
  };

  createResolvers(resolvers);
};
