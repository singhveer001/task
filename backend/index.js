import express from "express";
import categoryRoutes from './routes/category.route.js';
import productRoutes from './routes/product.route.js';

const app = express();
app.use(express.json());

app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes)

app.listen(3000, () => {
    console.log("Server Started")
})