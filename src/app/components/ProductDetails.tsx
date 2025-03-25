"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { Rating } from "@mui/material";


interface Product {
    _id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
    rating: number;
    image: string;
}

const ProductDetails = () => {
    const { id } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (!id) return;

        const fetchProductDetails = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/products/${id}`);
                const data = await res.json();
                if (data.success) {
                    setProduct(data.product);
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [id]);

    const increment = () => setQuantity((prev) => prev + 1);
    const decrement = () => {
        if (quantity > 1) setQuantity((prev) => prev - 1);
    };

    const addToCart = () => {
        if (product) {
            const cart = JSON.parse(localStorage.getItem("cart") || "[]");
            cart.push({ ...product, selectedQuantity: quantity });
            localStorage.setItem("cart", JSON.stringify(cart));
            alert("Added to cart!");
        }
    };

    const buyNow = () => {
        if (product) {
            localStorage.setItem(
                "checkoutItem",
                JSON.stringify({ ...product, selectedQuantity: quantity })
            );
            router.push("/checkout");
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!product) {
        return (
            <Typography variant="h6" color="error">
                Product not found.
            </Typography>
        );
    }

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: { xs: 3, md: 8 }, // More spacing between sections on desktop
                maxWidth: { xs: "100%", md: "1400px" }, // Increased max width
                minHeight: { xs: "auto", md: "700px" }, // Set a minimum height for desktop
                margin: "auto",
                padding: { xs: "20px", md: "80px" }, // Increased padding for vertical space
                mt: { xs: 0, md: "140px" }, // 14px margin-top only for desktop
                pb: 8,
                backgroundColor: "#f9f9f9",
                borderRadius: "16px", // Slightly more rounded corners
                boxShadow: "0px 6px 30px rgba(0, 0, 0, 0.15)", // Stronger shadow for a premium feel
                overflow: "hidden",
            }}
        >

            {/* Left: Product Image */}
            <Box sx={{ textAlign: "center" }}>
                <img
                    src={product.image}
                    alt={product.name}
                    style={{
                        width: "100%",
                        maxWidth: "500px",
                        height: "auto",
                        borderRadius: "12px",
                        boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.15)",
                    }}
                />
            </Box>

            {/* Right: Product Details */}
            <Box>
                <Typography variant="h3" fontWeight="bold" sx={{ color: "#333" }}>
                    {product.name}
                </Typography>
                <Typography variant="body1" color="textSecondary" sx={{ mt: 1, fontSize: "18px" }}>
                    Category: <b>{product.category}</b>
                </Typography>
                <Typography variant="h4" color="primary" sx={{ mt: 2, fontWeight: "bold" }}>
                    PKR {product.price}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, fontSize: "16px", color: "#555", display: "flex", alignItems: "center", gap: 1 }}>
                    <Rating value={product.rating} max={5} precision={1} readOnly />
                </Typography>

                {/* Quantity Controls */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        mt: 3,
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                        padding: "8px 12px",
                        width: "fit-content",
                        backgroundColor: "#fff",
                        boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <Button
                        onClick={decrement}
                        sx={{ minWidth: "40px", fontSize: "20px", fontWeight: "bold" }}
                    >
                        -
                    </Button>
                    <Typography sx={{ mx: 2, fontSize: "18px", fontWeight: "bold" }}>
                        {quantity}
                    </Typography>
                    <Button
                        onClick={increment}
                        sx={{ minWidth: "40px", fontSize: "20px", fontWeight: "bold" }}
                    >
                        +
                    </Button>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
                    <Button
                        onClick={buyNow}
                        variant="contained"
                        sx={{
                            backgroundColor: "#ff5722",
                            color: "#fff",
                            fontWeight: "bold",
                            fontSize: "18px",
                            padding: "12px",
                            borderRadius: "8px",
                            textTransform: "none",
                            "&:hover": { backgroundColor: "#e64a19" },
                        }}
                        fullWidth
                    >
                        Buy Now
                    </Button>
                    <Button
                        onClick={addToCart}
                        variant="outlined"
                        sx={{
                            borderColor: "#ff5722",
                            color: "#ff5722",
                            fontWeight: "bold",
                            fontSize: "18px",
                            padding: "12px",
                            borderRadius: "8px",
                            textTransform: "none",
                            "&:hover": { backgroundColor: "#ffede0", borderColor: "#ff5722" },
                        }}
                        fullWidth
                    >
                        Add to Cart
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default ProductDetails;
