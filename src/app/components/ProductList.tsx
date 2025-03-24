"use client"; // If using Next.js App Router

import { useEffect, useState } from "react";
import { Grid, Card, CardMedia, CardContent, Typography, CardActions, Button, CircularProgress, Box } from "@mui/material";

interface Product {
    _id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
    rating: number;
    image: string;
}

const ProductList = ({ refreshTrigger }: { refreshTrigger: boolean }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/products");
            const data = await res.json();
            if (data.success) {
                setProducts(data.products);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [refreshTrigger]); // 🔥 Re-fetch when refreshTrigger changes

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ textAlign: "center", mb: 4 }}>
                All Products
            </Typography>

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {products.map((product) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                            <Card sx={{ maxWidth: 345, boxShadow: 3 }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={product.image}
                                    alt={product.name}
                                    sx={{ objectFit: "cover" }}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h6" component="div">
                                        {product.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Category: {product.category}
                                    </Typography>
                                    <Typography variant="body1" color="primary">
                                        PKR: {product.price}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Rating: ⭐ {product.rating}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" color="primary">
                                        View Details
                                    </Button>
                                    <Button size="small" color="secondary">
                                        Add to Cart
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default ProductList;
