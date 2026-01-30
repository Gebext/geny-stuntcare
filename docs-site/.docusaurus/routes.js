import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '5ff'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '5ba'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'a2b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', 'c3c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '156'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '88c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '000'),
    exact: true
  },
  {
    path: '/',
    component: ComponentCreator('/', 'd5d'),
    routes: [
      {
        path: '/',
        component: ComponentCreator('/', '193'),
        routes: [
          {
            path: '/',
            component: ComponentCreator('/', '1ef'),
            routes: [
              {
                path: '/faq',
                component: ComponentCreator('/faq', '7c5'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/features',
                component: ComponentCreator('/features', '8bd'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/troubleshooting',
                component: ComponentCreator('/troubleshooting', 'c3d'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/user-guide',
                component: ComponentCreator('/user-guide', 'f07'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/',
                component: ComponentCreator('/', 'b56'),
                exact: true,
                sidebar: "docsSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
