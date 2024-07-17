
# Cryptocurrency Price Tracker
### clean all docker 
docker system prune -a
<br>

git clone https://github.com/vitgithup/CryptoPortfolioManager

## Start process
cd CryptoPortfolioManager <br>
docker compose up -d frontend_port

### Migration DB : only run at the first time
docker compose up -d db_port <br>
docker exec -it backend_port npx prisma migrate dev --name init <br>


## Backend
http://localhost:4001/
## Frontend
http://localhost:3001/


## coinmarketcap.com
user API from coinmarketcap.com.  Yse Quotes Latest v2. <br>
By change cryptocurrency name to slug as the query parameters.

### Quotes Latest v2
https://coinmarketcap.com/api/documentation/v1/#operation/getV2CryptocurrencyQuotesLatest

Query Parameters : skip_invalid  <span style="color:red">*** don't work</span>


program will use input cryptocurrency name and conver to slug to call the api : 
https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest



## Docker 


**frontend** : next.js front end user interface 


**backend** : prisma [https://www.prisma.io/] ,   express


**db** : postgresql

