export const menuArray = [
    {
        name: "Caremel Ice Cream",
        ingredients: ["pepperoni", "mushrom", "mozarella"],
        id: 0,
        price: 14,
        images: './images/caramel.png'
    },
    {
        name: "Chocolate Ice Cream",
        ingredients: ["beef", "cheese", "lettuce"],
        price: 10,
        images: './images/chocolate.png',
        id: 1
    },
    {
        name: "Vanilla Ice Cream",
        ingredients: ["grain, hops, yeast, water"],
        price: 11,
        images: './images/vanilla.png',
        id: 2
    },
    {
        name: "Ice Cream Pack",
        ingredients: ["grain, hops, yeast, water"],
        price: 24,
        images: './images/ice-cream-pack.png',
        id: 3
    },

]

export const combos = [
    {
        name:"Sweet Duo",
        items:[0,1],
        discount:0.5
    },
    {
        name:"Classic Combo",
        items:[1,2],
        discount:0.5
    },
]