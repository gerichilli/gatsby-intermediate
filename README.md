# Gastby Intermediate Course ([Course Slides](https://frontendmasters.learnwithjason.dev/intermediate-gatsby/))

## Table of contents

- [Gatsby APIs](#gatsby-apis)
  - [createPage](#createpage)
  - [createNode](#createtypes)
  - [createPage](#createpage)
  - [Create Custom Resolvers for Data Types with createResolvers](#create-custom-resolvers-for-data-types-with-createresolvers)
  - [reateRemoteFileNode](#reateremotefilenode)
- [Working With Custom Data](#working-with-custom-data)
- [Setup Gastby Theme](#setup-gastby-theme)

## Gatsby APIs

### createPage

- [createPage - Gatsby Docs](https://www.gatsbyjs.com/docs/reference/config-files/actions/#createPage)

```
createPage(pageObject, plugin, actionOptions)
```

```
exports.createPages = async ({ actions, graphql }) => {
    const { createPage } = actions;

    // createPage(pageObject, plugin, actionOptions)

    createPage({
        path: '/custom', // Any valid URL. Must start with a forward slash (/)
        component: require.resolve('./src/templates/custom.js'), // absolute path to the component for this page
        context: {
        // data for page, passed as props to the component this.props.pageContext
        title: 'Gatsby Site',
        meta: {
            description: 'Gatsby Site Description',
        },
        },
    });
}
```

### createNode

- [createNode - Gatsby Docs](https://www.gatsbyjs.com/docs/reference/config-files/actions/#createNode)

```
exports.sourceNodes = ({ actions, createNodeId, createContentDigest }) => {
    const { createNode } = actions;

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
}
```

### createTypes

- [createTypes - Gatsby Docs](https://www.gatsbyjs.com/docs/reference/config-files/actions/#createNode)
- Create relation of 2 nodes

```
exports.sourceNodes = ({ actions, createNodeId, createContentDigest }) => {
    const { createNode, createTypes } = actions;

    createTypes(`
        type Book implements Node {
            author: Author! @link(by: "slug" from: "author")
        }

        type Author implements Node {
            books: [Book!]! @link(by: "author.slug" from: "slug")
        }
    `);
}
```

#### Notes

- [Book!]! - array of books, or empty array, but never null
- **@link, from, by**: [Gatsby Docs](https://www.gatsbyjs.com/docs/reference/graphql-data-layer/schema-customization/#foreign-key-fields)
- **@link**: connect to a different Node
- **by**: foreign-key - define which field to use on the source node
- **from**: optional - getting the field on the current type which acts as the foreign-key to the field specified in by
- type Book
  - When I'm in the book type, I want to access the author information
  - Use the value from book.author, match it by the field author.slug
- type Author
  - When I'm in the author, I want to access all the books that are written by this author
  - Use the value from author.slug and match it by the field book.author.slug

### Create Custom Resolvers for Data Types with createResolvers

- [createResolvers - Gatsby Docs](https://www.gatsbyjs.com/docs/reference/graphql-data-layer/schema-customization/#createresolvers-api)

```
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
    }

    createResolvers(resolvers);
}
```

### createRemoteFileNode

- [createRemoteFileNode - Gatsby Docs](https://www.gatsbyjs.com/docs/reference/graphql-data-layer/schema-customization/#createresolvers-api)
- Makes it easy to download remote files and add them to site’s GraphQL schema

```
createRemoteFileNode({
    url: `https://covers.openlibrary.org/b/id/${covers[0]}-L.jpg`, // The source url of the remote file
    store, // The id of the parent node
    cache, // Gatsby's cache which the helper uses to check if the file has been downloaded already
    createNode, // The action used to create nodes
    createNodeId, // A helper function for creating node Ids
    reporter,
});
```

## Working With Custom Data

- Using page query [Docs](https://www.gatsbyjs.com/docs/how-to/querying-data/page-query/)

```
export const query = graphql`
    query HomePageQuery {
        site {
            siteMetadata {
                description
            }
        }
    }
```

- The `data` prop contains the results of the page GraphQL query, and matches the shape of the

```
const HomePage = ({data}) => {
    return (
        <div>
            {data.site.siteMetadata.description}
        </div>
    )
}
```

## Setup Gastby Theme

1. Create theme folder

- Create `gatsby-config.js`
- Create `package.json` and add some information

2. Install gatsby in peerDependencies of theme

```
yarn workspace gatsby-theme-shared-nav add -P gatsby@x.xx.x
```

3. Install theme into site

```
yarn workspace site add gatsby-theme-shared-nav@"*"
```

- @"\*": get it to pickup a local theme

4. Create a layout

- Create styles and layout component
- Install `gatsby-plugin-layout` to theme [Docs](https://www.gatsbyjs.com/plugins/gatsby-plugin-layout/#gatsby-plugin-layout)
- Once the plugin is added, you don’t need to manually wrap your pages with the Layout component. The plugin does this automastically.

  ```
  yarn workspace gatsby-theme-shared-nav add gatsby-plugin-layout
  ```

- add plugin in `gatsby-config.js` of theme

```
    plugins: [
        // other plugins
        {
            resolve: 'gatsby-plugin-layout',
            options: {
                component: require.resolve(__dirname + '/src/components/layout.js'),
            },
        },
    ],
```

- add theme `gatsby-theme-shared-nav` in `gatsby-config.js` of site

```
plugins: [
    // other plugins
    'gatsby-theme-shared-nav',
],
```

## Other tools and resouces

- yarn

  ```
      npm run develop -w site
      yarn workspace site develop
  ```

- workspace
- slugify
- node-fetch
- npm-install-peers