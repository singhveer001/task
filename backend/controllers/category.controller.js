import { client } from "../db.js";

export const getAllCategory = async (req,res) => {
    try {
        const data = await client.query('SELECT * FROM category');
        res.status(200).json({
            categories : data.rows
        })
    } catch (error) {
        console.log("Error While getting categories: ",error)
        res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

export const createCategory = async (req,res) => {
    const { name } = req.body;
    if(!name) {
        res.status(400).json({
            message : "Category name is required"
        })
        return;
    }
    try {
        const data = await client.query(
            'INSERT INTO category (category_name) VALUES($1) RETURNING *',[name]
        )
        res.status(201).json({
            message : "Category Created Successfully"
        })
    } catch (error) {
        console.log("Error Creating Category:", error)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const updateCategory = async (req,res) => {
    const categoryId = Number(req.params.id);
    const { name } = req.body;
    try {
        const updateData = await client.query(
            `UPDATE category SET category_name = $1
             WHERE category_id = $2
             RETURNING *`,
             [name, categoryId]
        )
        if(updateData.rowCount === 0){
            return res.status(404).json({
                message : "Category not found"
            })
        }
        res.status(200).json({
            category : updateData.rows[0],
            message : "Category Updated Successfully"
        })
    } catch (error) {
        console.log("Error Updatng Category", error)
        res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

export const deleteCategory = async  (req,res) => {
    const categoryId = Number(req.params.id);
    try {
        const data = await client.query(
            `DELETE FROM category WHERE category_id = $1`,[categoryId]
        );
        if(data.rowCount === 0){
            return res.status(404).json({
                message : "Category not found"
            })
        }
        res.status(200).json({
            message : "Category deleted successfully"
        })
    } catch (error) {
        console.log("Error deleting category:", error)
        res.status(500).json({
            message : "Internal Server Error"
        })
    }
}