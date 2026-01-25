**Registration Process**
`GET /ecpp-backend/oauth/realms/:realm/registration` - редирект на фронтенд login
`POST /ecpp-backend/oauth/realms/:realm/registration` - принимает креды для регистрации multipart/form-data. В случае успеха выпускаем auth_code и редиректим 

**Authorization Code Grant**

На бекенде реализовать метод при переходе на который, методом POST будет происходить авторизация  
`GET /ecpp-backend/oauth/realms/:realm/authorize?response_type=code` - отправляем пользователя на фронтенд на страницу login, если есть сессия, то сразу сделать редирект на клиента с auth_code
`POST /ecpp-backend/oauth/realms/:realm/token` - ендпоинт для получения access token
`POST /ecpp-backend/oauth/realms/:realm/authenticate` - принимает креды для auth code грант чтобы авторизовать юзера - сетит куку

После запроса на авторизацию методом Authorization Code Grant - необходимо отобразить форму
в соответствий со спецификацией Oauth2. Чтобы избежать сложности работы с шаблонами и формами 
на бекенде - мы делегируем это на фронтенд, определяя интерфейс и требования которые он должен реализовать.  
А именно:  
`OAUTH_FRONTEND_URL=` - переменная окружения которая ведет на корень фронтенда, где реализованы следущие требования

**Требования к фронтенду**
Должны быть реализованы следующие страницы которые работают с протоколом oauth  

`GET /oauth/realms/:realm/login` - открывается форма для авторизации

`GET /oauth/realms/:realm/registation` - открывается форма с регистрацией  
`POST /oauth/realms/:realm/registation` - открывается форма с регистрацией, если есть ошибки, то они передаются в ином случае выпускается auth code и регистрируется юзер

`oauth/realms/:realm/reset-credentials` - открывается форма сброса пароля
