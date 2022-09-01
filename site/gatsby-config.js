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
      {
        label: 'Dashboard',
        path: '/account',
      },
    ],
  },
  plugins: [
    'gatsby-theme-shared-nav',
    'gatsby-plugin-image',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    'gatsby-plugin-netlify',
  ],
};
