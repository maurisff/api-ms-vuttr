# api-ms-vuttr
Back-end para implementação do desafio VUTTR da BossaBox


# Build, push imagem to register and run app db local and db mongoAtlas
docker build -o out -t <user register>/api-ms-vuttr .
push to register
docker push <user register>/api-ms-vuttr
docker run --name api-vuttr -d -p 3000:3000 -e MONGO_DB=mongodb://localhost:27017/db-ms-vuttr -e JWT_SECRET=123456 <user register>/api-ms-vuttr
docker run --name api-vuttr -d -p 3000:3000 -e MONGO_DB=mongodb+srv://<user>:<password>@<database-id>.mongodb.net/<dbname>?retryWrites=true&w=majority -e JWT_SECRET=123456 <user register>/api-ms-vuttr
