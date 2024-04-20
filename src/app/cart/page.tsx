"use client";

import { CartApiClient } from "@/apiClients/CartApiClient";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Cart as CartType, Product } from "@prisma/client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { ImBin } from "react-icons/im";

interface CartWithProduct extends CartType {
    product: Product;
}
const Cart = () => {
    const [cart, setCart] = useState<CartWithProduct[]>([
        {
            id: 1,
            userId: 1,
            productId: 1,
            quantity: 6,
            createdAt: new Date("2024-04-17T13:12:20.065Z"),
            updatedAt: new Date("2024-04-17T13:45:10.357Z"),
            product: {
                id: 1,
                categoryId: 2,
                name: "Uppland",
                price: 84900,
                description:
                    "You know the feeling when you sit, lie down or hang out in a sofa, rather than on it. That’s how embracing the deep and generous UPPLAND sofa is – your new favorite place for cozy evenings and lazy days!",
                image: "sofa/sofa-1",
                imageCount: 5,
                location: "living-room:office",
                createdAt: new Date("2024-04-08T18:36:42.000Z"),
                updatedAt: new Date("2024-04-08T19:49:16.893Z"),
            },
        },
    ]);
    const [subtotal, setSubtotal] = useState(0);
    const [shipping, setShipping] = useState(0);
    const [total, setTotal] = useState(0);

    const fetchUserCart = () => {
        CartApiClient.getCartItems({ userId: 1 })
            .then((res) => {
                setCart(res.data);
                calculateOrderSummary();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const calculateOrderSummary = () => {
        const sumOfItemTotal = cart.reduce(
            (acc, cartItem) => acc + cartItem.product.price * cartItem.quantity,
            0,
        );
        setSubtotal(sumOfItemTotal);
        setShipping(1000);
        setTotal(sumOfItemTotal + 1000);
    };

    useEffect(() => {
        fetchUserCart();
    }, []);

    const mapCartItems = () => {
        return cart.map((cartItem) => {
            const itemTotal = cartItem.product.price * cartItem.quantity;
            return (
                <>
                    <div className="flex w-full items-start justify-between gap-4 py-8">
                        <div className="aspect-square h-64 w-64 rounded bg-gray-100 p-3">
                            <Image
                                height={600}
                                width={600}
                                src={`/furniture/${cartItem.product.image}-1.avif`}
                                alt={cartItem.product.name}
                                className="h-full w-full shrink-0 rounded-lg object-contain"
                            />
                        </div>
                        <div className="relative flex h-64 w-full flex-col p-4">
                            <p className="text-2xl font-bold text-primary-dark">
                                {cartItem.product.name}
                            </p>
                            <h4 className="mt-4 text-lg font-bold text-primary-dark">
                                Rs {cartItem.product.price}
                            </h4>
                            <div className="bottom mb-0 mt-auto flex items-center justify-between">
                                <div className="flex-center w-fit gap-0">
                                    <button
                                        className={`flex-center h-10 w-10 rounded-bl-md rounded-tl-md border hover:bg-slate-200 ${
                                            cartItem.quantity == 1 &&
                                            "cursor-not-allowed"
                                        }`}
                                    >
                                        <FaMinus />
                                    </button>
                                    <input
                                        type="text"
                                        value={cartItem.quantity}
                                        className="h-10 w-10 border text-center text-xl"
                                    />
                                    <button className="flex-center h-10 w-10 rounded-br-md rounded-tr-md border hover:bg-slate-200">
                                        <FaPlus />
                                    </button>
                                </div>
                                <div className="itemTotal text-2xl font-bold text-primary-dark">
                                    Rs {itemTotal}
                                </div>
                            </div>
                            <ImBin
                                className="absolute right-4 top-4 cursor-pointer text-2xl text-red-500"
                                title="remove"
                            />
                        </div>
                    </div>
                </>
            );
        });
    };

    return (
        <>
            <Navbar />
            <div className="bg-white font-[sans-serif]">
                <div className="mx-auto max-w-xl lg:max-w-7xl">
                    <h2 className="text-3xl font-extrabold text-[#333]">
                        Shopping Cart
                    </h2>
                    <div className="mt-8 grid items-start gap-8 lg:grid-cols-3">
                        <div className="divide-y lg:col-span-2">
                            {/* data here */}
                            {mapCartItems()}
                        </div>
                        <div className="my-10 bg-gray-100 p-8">
                            <h3 className="text-2xl font-bold text-[#333]">
                                Order summary
                            </h3>
                            <ul className="mt-6 divide-y text-[#333]">
                                <li className="text-md flex flex-wrap gap-4 py-3">
                                    Subtotal{" "}
                                    <span className="ml-auto font-bold">
                                        Rs {subtotal}
                                    </span>
                                </li>
                                <li className="text-md flex flex-wrap gap-4 py-3">
                                    Shipping{" "}
                                    <span className="ml-auto font-bold">
                                        Rs {shipping}
                                    </span>
                                </li>
                                <li className="text-md flex flex-wrap gap-4 py-3 font-bold">
                                    Total{" "}
                                    <span className="ml-auto">Rs {total}</span>
                                </li>
                            </ul>
                            <button
                                type="button"
                                className="btn-primary-light btn border-none px-8 shadow-lg"
                            >
                                Check out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Cart;
