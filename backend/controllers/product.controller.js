import { pool } from "../db.js";

export const getAllProduct = async (req,res) => {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const offset = (page -1) * pageSize;
    try {
        const data = await pool.query(`
            SELECT product_id, product_name, category.category_id, category.category_name
            FROM product
            JOIN category ON product.category_id = category.category_id
            ORDER BY product_id
            LIMIT $1 OFFSET $2`,
            [pageSize,offset]
        );
        res.status(200).json({
            products : data.rows,
            page,
            pageSize
        })
    } catch (error) {
        console.log("Error fetching product: ",error)
        res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

export const createProduct = async (req,res) => {
    const { name, categoryId } = req.body;
    if(!name || !categoryId) {
        res.status(400).json({
            message : "product name and categoryId are required"
        })
        return;
    }
    try {
        const data = await pool.query(
            'INSERT INTO product (product_name, category_id) VALUES( $1, $2 ) RETURNING *',
            [name, categoryId]
        )
        res.status(201).json({
            message : "Product Created Successfully"
        })
    } catch (error) {
        console.log("Error Creating product:", error)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const updateProduct = async (req,res) => {
    const productId = Number(req.params.id);
    const { name, categoryId } = req.body;
    if (!name || !categoryId) {
        return res.status(400).json({ 
            message: "Product name and categoryId are required" 
        });
    }
    try {
        const updateProduct = await pool.query(
            `UPDATE product 
             SET product_name = $1, category_id = $2
             WHERE product_id = $3
             RETURNING *`,
             [name, categoryId, productId]
        )
        if(updateProduct.rowCount === 0){
            return res.status(404).json({
                message : "Product not found"
            })
        }
        res.status(200).json({
            product : updateProduct.rows[0],
            message : "Product Updated Successfully"
        })
    } catch (error) {
        console.log("Error Updating Product", error)
        res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

export const deleteProduct = async  (req,res) => {
    const productId = Number(req.params.id);
    try {
        const data = await pool.query(
            `DELETE FROM product WHERE product_id = $1`,[productId]
        );

        res.status(200).json({
            message : "Product deleted successfully"
        })
    } catch (error) {
        console.log("Error deleting product: ", error)
        res.status(500).json({
            message : "Internal Server Error"
        })
    }
}