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
    ratings: number[]; // Store all user ratings
    image: string;
    description: string;
}

const ProductDetails = () => {
    const { id } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [userRating, setUserRating] = useState<number | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchProductDetails = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/products/${id}`);
                const data = await res.json();
                if (data.success) {
                    setProduct(data.product);
                    // Calculate and set the average rating rounded to nearest 0.5
                    if (data.product.ratings?.length) {
                        const avgRating =
                            Math.round(
                                (data.product.ratings.reduce((sum: number, r: number) => sum + r, 0) /
                                    data.product.ratings.length) *
                                2
                            ) / 2;
                        setUserRating(avgRating);
                    } else {
                        setUserRating(0);
                    }
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [id]);

    const handleRatingChange = async (newValue: number | null) => {
        if (!product || newValue === null) return;

        // Round rating to nearest 0.5
        const roundedRating = Math.round(newValue * 2) / 2;

        // Avoid unnecessary API calls if rating remains the same
        if (userRating === roundedRating) return;

        setUserRating(roundedRating); // Instantly update UI

        try {
            const res = await fetch("/api/products/updateProduct", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ _id: product._id, rating: roundedRating }),
            });

            const data = await res.json();
            if (data.success) {
                setProduct((prev) => (prev ? { ...prev, rating: roundedRating } : prev));
            }
        } catch (error) {
            console.error("Error updating rating:", error);
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
                gap: { xs: 3, md: 8 },
                maxWidth: { xs: "100%", md: "1400px" },
                minHeight: { xs: "auto", md: "700px" },
                margin: "auto",
                padding: { xs: "20px", md: "80px" },
                mt: { xs: 0, md: "140px" },
                pb: 8,
                backgroundColor: "#f9f9f9",
                borderRadius: "16px",
                boxShadow: "0px 6px 30px rgba(0, 0, 0, 0.15)",
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
                    <b>Category: </b>
                    {product.category}
                </Typography>
                <Typography variant="h4" color="primary" sx={{ mt: 2, fontWeight: "bold" }}>
                    PKR {product.price}
                </Typography>

                {/* Rating Section */}
                <Box sx={{ mt: 2 }}>
                    <Rating
                        value={userRating}
                        max={5}
                        precision={0.5} // Ensure users can select ratings in 0.5 increments
                        onChange={(_, newValue) => handleRatingChange(newValue)}
                    />
                </Box>

                {/* Description */}
                <Typography variant="body1" sx={{ mt: 2, fontSize: "16px", color: "text.primary", lineHeight: 1.5 }}>
                    <b>Description: </b> {product.description ?? "No description available"}
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
                    <Button onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}>-</Button>
                    <Typography sx={{ mx: 2, fontSize: "18px", fontWeight: "bold" }}>{quantity}</Typography>
                    <Button onClick={() => setQuantity((prev) => prev + 1)}>+</Button>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
                    <Button
                        onClick={() => {
                            localStorage.setItem(
                                "checkoutItem",
                                JSON.stringify({ ...product, selectedQuantity: quantity })
                            );
                            router.push("/checkout");
                        }}
                        variant="contained"
                        sx={{ backgroundColor: "#ff5722", color: "#fff", fontWeight: "bold" }}
                        fullWidth
                    >
                        Buy Now
                    </Button>
                    <Button
                        onClick={() => {
                            const cart = JSON.parse(localStorage.getItem("cart") || "[]");
                            cart.push({ ...product, selectedQuantity: quantity });
                            localStorage.setItem("cart", JSON.stringify(cart));
                            alert("Added to cart!");
                        }}
                        variant="outlined"
                        sx={{ borderColor: "#ff5722", color: "#ff5722", fontWeight: "bold" }}
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
