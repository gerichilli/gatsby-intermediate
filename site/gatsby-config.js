module.exports = {
  siteMetadata: {
    title: 'My book club',
    navItems: [
      {
        label: 'Books',
        path: '/books',
      },
      {
        label: 'Authors',
        path: '/authors',
      },
    ],
  },
  plugins: [
    'gatsby-theme-shared-nav',
    'gatsby-plugin-image',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
  ],
};
