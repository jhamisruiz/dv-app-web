// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  host: 'localhost:8002',
  wsHost: 'prueba/ws',
  wsSSL: true,

  apiHost: 'localhost:8002',
  apiVersion: 'v1',
  apiSSL: false,
  //develop mode
  userName: 'pp',
  userPass: '123',

  dataLayoutMode: 'dark',//dark | light
  dataLayout: 'horizontal',//horizontal | vertical | semibox

  //backend public
  hostPublic: 'http://localhost:8002',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

/*
miapp /
├── cmd /
│   └── main.go
│   ├── usuario /
│       ├── application /
│       │   ├── service /
│       │   │   └── usuario.service.go
│       │   └── usecase /
│       │       └── usuario.usecase.go
│       │
│       ├── domain /
│       │   ├── entity /
│       │   │   └── usuario.entity.go
│       │   ├── mapping /
│       │   │   └── usuario.mapping.go
│       │   ├── model /
│       │   │   └── usuario.model.go
│       │   ├── repository /
│       │   │   └── usuario.repository.go
│       │   ├── usecase /
│       │   │   └── usuario.usecase.go
│       │   └── valueobject /
│       │       └── usuario.response.go
│       │
│       ├── infrastructure /
│       │   ├── delivery /
│       │   │   └── http /
│       │   │       ├── controller /
│       │   │       │   └── usuario.controller.go
│       │   │       └── routes /
│       │   │           └── usuario.routes.go
│       │   │
│       │   └── persistence /
│       │       └── mssql_repository /
│       │           └── usuario.mssql.go
│       │
│       └── usuario.mnt.go
│
└── config /
    └── config.yaml


*/
